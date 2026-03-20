import assemblyai as aai
import google.generativeai as genai
from config.settings import settings
import json
import re
import os
import asyncio

# ─── LLM CONFIG (Gemini) ──────────────────────────────────────────────────────
genai.configure(api_key=settings.GEMINI_API_KEY)
# We use gemini-flash-latest for stable free-tier access
gemini_model = genai.GenerativeModel('gemini-flash-latest')

# ─── CLOUD AUDIO CONFIG (AssemblyAI) ───────────────────────────────────────────
aai.settings.api_key = settings.ASSEMBLYAI_API_KEY


FILLER_WORD_PATTERN = re.compile(
    r"\b(um|uh|like|you know|basically|actually|literally|so)\b",
    re.IGNORECASE,
)

def _clamp(value: float, low: int = 0, high: int = 100) -> int:
    return max(low, min(high, int(round(value))))

def _build_local_feedback(transcription: str, reason: str | None = None) -> dict:
    """Fallback logic if LLM fails"""
    text = (transcription or "").strip()
    words = re.findall(r"\b[\w']+\b", text)
    sentences = [part.strip() for part in re.split(r"[.!?]+", text) if part.strip()]
    filler_words = len(FILLER_WORD_PATTERN.findall(text))

    word_count = len(words)
    avg_sentence_length = word_count / max(len(sentences), 1)
    unique_ratio = (len(set(word.lower() for word in words)) / max(word_count, 1)) if words else 0

    speech_clarity = _clamp(88 - filler_words * 4 - max(avg_sentence_length - 18, 0) * 1.5)
    grammar_score = _clamp(84 + unique_ratio * 12 - filler_words * 2)
    confidence_score = _clamp(82 - filler_words * 3 + min(word_count, 120) / 12)
    pace = _clamp(74 + min(word_count, 140) / 5 - max(avg_sentence_length - 20, 0) * 1.2)

    if not text or text == "Audio transcription failed.":
        return {
            "ai_evaluation": {
                "ai_feedback": "We could not extract enough speech content to coach this response. Please retry with a clearer recording.",
                "speech_clarity": 0,
                "filler_words": 0,
                "pace": 0,
                "grammar_score": 0,
                "confidence_score": 0,
                "feedback_source": "local_fallback",
                "fallback_reason": reason or "missing_transcription",
            }
        }

    return {
        "ai_evaluation": {
            "ai_feedback": "Your response is fairly clear. Focus on reducing filler words and speaking with more deliberate pauses to improve confidence.",
            "speech_clarity": speech_clarity,
            "filler_words": filler_words,
            "pace": pace,
            "grammar_score": grammar_score,
            "confidence_score": confidence_score,
            "feedback_source": "local_fallback",
            "fallback_reason": reason or "llm_unavailable",
        }
    }

# STEP 1: AUDIO -> TEXT (AssemblyAI)
async def process_audio_transcription(file_path: str) -> str:
    """Uses AssemblyAI to transcribe audio files"""
    if not os.path.exists(file_path):
        return "Audio file not found."

    if not settings.ASSEMBLYAI_API_KEY:
        print("AssemblyAI Key missing.")
        return "Audio transcription failed due to missing API key."

    try:
        print(f"Transcribing {file_path} via AssemblyAI...")
        # Run synchronous AssemblyAI call inside a thread to keep FastAPI non-blocking
        loop = asyncio.get_event_loop()
        config = aai.TranscriptionConfig(speech_models=["universal-2"])
        transcriber = aai.Transcriber(config=config)
        transcript = await loop.run_in_executor(None, lambda: transcriber.transcribe(file_path))
        
        if transcript.status == aai.TranscriptStatus.error:
            print(f"AssemblyAI Error: {transcript.error}")
            return "Audio transcription failed."

        text = transcript.text.strip() if transcript.text else ""
        print(f"Transcription Result: {text}")
        return text if text else "No speech detected."

    except Exception as e:
        print(f"AssemblyAI processing error: {e}")
        return "Audio transcription failed."

# STEP 2: TEXT -> AI FEEDBACK (Google Gemini)
async def process_generative_feedback(transcription: str) -> dict:
    """Uses Google Gemini API to generate structured coaching feedback"""
    if not settings.GEMINI_API_KEY:
        print("Gemini API Key missing, using local fallback.")
        return _build_local_feedback(transcription, reason="missing_gemini_key")

    prompt = f"""
    You are an expert English communication coach.
    Analyze the following student's speech transcription:
    "{transcription}"

    Evaluate based on confidence, fluency, and professional impact.
    
    Return ONLY a JSON object with these fields:
    - ai_feedback: (string, exactly two short coaching sentences)
    - speech_clarity: (int 0-100)
    - filler_words: (int, count of words like 'um', 'uh', 'like', 'you know')
    - pace: (int 0-100, where 50 is ideal)
    - grammar_score: (int 0-100)
    - confidence_score: (int 0-100)
    """

    try:
        # Gemini does not support response_format="json" like OpenAI yet in some SDK versions, 
        # so we rely on explicit prompt and simple parsing
        response = await asyncio.to_thread(lambda: gemini_model.generate_content(prompt))
        
        content = response.text.strip()
        # Remove any markdown code blocks if the AI included them
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()

        data = json.loads(content)
        print("Gemini Evaluation:", data)

        return {
            "ai_evaluation": {
                **data,
                "feedback_source": "gemini"
            }
        }

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return _build_local_feedback(transcription, reason=str(e))
