from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from auth.jwt_handler import get_current_user_id
from database import practice_collection, speech_collection, progress_collection
from models.schemas import PracticeSessionStartRequest
from services.speech_service import process_audio_transcription, process_generative_feedback
from datetime import datetime
from bson import ObjectId
import os
import shutil
from pathlib import Path

router = APIRouter(prefix="/practice", tags=["Practice Module"])

ALLOWED_AUDIO_TYPES = {
    "audio/webm", "audio/mp3", "audio/mpeg", "audio/wav",
    "audio/ogg", "audio/m4a", "audio/aac", "audio/x-m4a",
    "audio/mp4", "audio/flac"
}


def _safe_audio_path(prefix: str, file_name: str) -> str:
    original_name = Path(file_name or "audio.webm").name
    extension = Path(original_name).suffix or ".webm"
    return f"uploads/{prefix}{extension}"

@router.post("/start")
async def start_practice_session(
    payload: PracticeSessionStartRequest, 
    user_id: str = Depends(get_current_user_id)
):
    """
    Establishes a new database record marking the initiation of an active Practice Session.
    """
    new_session = {
        "user_id": user_id,
        "topic": payload.topic,
        "created_at": datetime.utcnow()
    }
    result = await practice_collection.insert_one(new_session)
    return {
        "message": "Practice tracking launched", 
        "session_id": str(result.inserted_id)
    }

@router.post("/submit")
async def upload_speech_audio(
    session_id: str = Form(...), 
    duration: int = Form(0),
    audio: UploadFile = File(...), 
    user_id: str = Depends(get_current_user_id)
):
    """
    Attaches media payload directly to an active Practice Session.
    Initiates external service Whisper Inference mappings, and GenAI Coaching logic sequentially.
    """
    # Verify exact Session binding validity
    session = await practice_collection.find_one({"_id": ObjectId(session_id), "user_id": user_id})
    if not session:
        raise HTTPException(status_code=404, detail="Active sequence missing.")

    if audio.content_type and audio.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported audio format: {audio.content_type}")
        
    # Process Payload File safely to IO disk limits (Ideally map to S3 long term)
    os.makedirs("uploads", exist_ok=True)
    temp_media_path = _safe_audio_path(session_id, audio.filename)
    with open(temp_media_path, "wb") as buff:
        shutil.copyfileobj(audio.file, buff)

    if os.path.getsize(temp_media_path) == 0:
        if os.path.exists(temp_media_path):
            os.remove(temp_media_path)
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty.")
        
    # Kickoff Analytics Engines Pipelines
    transcription = await process_audio_transcription(temp_media_path)
    analysis_data = await process_generative_feedback(transcription, session.get("topic"))
    
    # Safely extract the inner evaluation dictionary
    ai_eval = analysis_data.get("ai_evaluation", {})

    # Mirror results inside Main Session Collection History
    update_data = {
        "audio_file": temp_media_path,
        "transcription": transcription,
        "ai_feedback": ai_eval.get("ai_feedback"),
        "confidence_score": ai_eval.get("confidence_score"),
        "duration": duration
    }
    await practice_collection.update_one({"_id": ObjectId(session_id)}, {"$set": update_data})

    # Cleanup temp audio file from disk after processing (prevent accumulation)
    if os.path.exists(temp_media_path):
        os.remove(temp_media_path)
    
    # Store analytical factors inside distinct isolated Collection
    granular_entry = {
        "session_id": session_id,
        "speech_clarity": ai_eval.get("speech_clarity"),
        "filler_words": ai_eval.get("filler_words"),
        "pace": ai_eval.get("pace"),
        "grammar_score": ai_eval.get("grammar_score"),
        "confidence_score": ai_eval.get("confidence_score")
    }
    await speech_collection.insert_one(granular_entry)
    
    # Force generic Confidence mapping curve increment to users global Progress chart.
    # Also persist speech_clarity, pace, filler_words so Dashboard Avg Fluency is non-zero.
    await progress_collection.insert_one({
        "user_id": user_id,
        "confidence_score": ai_eval.get("confidence_score"),
        "speech_clarity": ai_eval.get("speech_clarity"),
        "pace": ai_eval.get("pace"),
        "filler_words": ai_eval.get("filler_words"),
        "pronunciation_score": ai_eval.get("pronunciation_score"),
        "content_clarity": ai_eval.get("content_clarity"),
        "expression_score": ai_eval.get("expression_score"),
        "grammar_score": ai_eval.get("grammar_score"),
        "duration": duration,
        "date": datetime.utcnow()
    })
    
    return {
        "status": "Inference Complete",
        "transcription_detected": transcription,
        "ai_evaluation": ai_eval
    }
