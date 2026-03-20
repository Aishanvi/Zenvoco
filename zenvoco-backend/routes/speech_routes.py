from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from auth.jwt_handler import get_current_user_id
from services.speech_service import process_audio_transcription, process_generative_feedback
import os
import shutil

router = APIRouter(prefix="/speech", tags=["Speech Analysis"])

@router.post("/analyze")
async def process_speech_one_off(
    audio: UploadFile = File(...), 
    user_id: str = Depends(get_current_user_id)
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
    tmp_path = f"uploads/tmp_{audio.filename}"
    
    with open(tmp_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)
        
    transcription = await process_audio_transcription(tmp_path)
    feedback_data = await process_generative_feedback(transcription)
    
    # Cleanup memory trace
    if os.path.exists(tmp_path):
        os.remove(tmp_path)
        
    return {
        "status": "success",
        "transcription_result": transcription,
        "feedback_object": feedback_data
    }
