from fastapi import APIRouter, UploadFile, File, HTTPException
from services.speech_service import process_audio_transcription, process_generative_feedback
import os
import shutil
from pathlib import Path

router = APIRouter(prefix="/speech", tags=["Speech Analysis"])


def _safe_audio_path(file_name: str) -> str:
    original_name = Path(file_name or "audio.webm").name
    extension = Path(original_name).suffix or ".webm"
    return f"uploads/tmp_{Path(original_name).stem}{extension}"

@router.post("/analyze")
async def process_speech_one_off(
    audio: UploadFile = File(...)
):
    """
    Allows executing a Whisper -> Generative AI Feedback Pipeline evaluation without
    recording the payload into the central tracking system. Useful for Frontend "try it out" flows.
    """
    # Validate that the uploaded file is an audio type
    ALLOWED_AUDIO_TYPES = {
        "audio/webm", "audio/mp3", "audio/mpeg", "audio/wav",
        "audio/ogg", "audio/m4a", "audio/aac", "audio/x-m4a",
        "audio/mp4", "audio/flac"
    }
    if audio.content_type and audio.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported audio format: {audio.content_type}")

    os.makedirs("uploads", exist_ok=True)
    tmp_path = _safe_audio_path(audio.filename)
    
    with open(tmp_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    if os.path.getsize(tmp_path) == 0:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty.")
        
    transcription_data = await process_audio_transcription(tmp_path)
    feedback_data = await process_generative_feedback(transcription_data)
    
    # Cleanup memory trace
    if os.path.exists(tmp_path):
        os.remove(tmp_path)
        
    return {
        "status": "success",
        "transcription_result": transcription_data.get("text", ""),
        "ai_evaluation": feedback_data.get("ai_evaluation", {}),
        "feedback_object": feedback_data
    }
