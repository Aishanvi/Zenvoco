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

    F = _clamp(88 - filler_words * 4 - max(avg_sentence_length - 18, 0) * 1.5)
    P = _clamp(85 - filler_words * 2)
    C = _clamp(90 - max(avg_sentence_length - 20, 0) * 1.2)
    V = _clamp(84 + unique_ratio * 12 - filler_words * 2)
    S = _clamp(74 + min(word_count, 140) / 5 - max(avg_sentence_length - 20, 0) * 1.2)
    E = _clamp(80 - filler_words * 3)

    ci_val = 0.214 * F + 0.214 * P + 0.214 * C + 0.143 * V + 0.143 * S + 0.071 * E
    confidence_score = _clamp(ci_val)

    if not text or text == "Audio transcription failed.":
        return {
            "ai_evaluation": {
                "ai_feedback": "We could not extract enough speech content to coach this response. Please retry with a clearer recording.",
                "speech_clarity": 0,
                "filler_words": 0,
                "pace": 0,
                "grammar_score": 0,
                "confidence_score": 0,
                "pronunciation_score": 0,
                "content_clarity": 0,
                "expression_score": 0,
                "feedback_source": "local_fallback",
                "fallback_reason": reason or "missing_transcription",
            }
        }

    return {
        "ai_evaluation": {
            "ai_feedback": "Your response is fairly clear. Focus on reducing filler words and speaking with more deliberate pauses to improve confidence.",
            "speech_clarity": _clamp(F),
            "filler_words": filler_words,
            "pace": _clamp(S),
            "grammar_score": _clamp(V),
            "confidence_score": confidence_score,
            "pronunciation_score": _clamp(P),
            "content_clarity": _clamp(C),
            "expression_score": _clamp(E),
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
        config = aai.TranscriptionConfig(speech_models=["universal-2"], disfluencies=True)
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
async def process_generative_feedback(transcription: str, topic: str = None) -> dict:
    """Uses Google Gemini API to generate structured coaching feedback"""
    if not settings.GEMINI_API_KEY:
        print("Gemini API Key missing, using local fallback.")
        return _build_local_feedback(transcription, reason="missing_gemini_key")

    topic_context = f"\n\nThe student was asked to speak about this topic/question:\n'{topic}'\nEvaluate how well they addressed this specific topic in your feedback." if topic else ""

    prompt = f"""
    You are an expert English communication coach.
    Analyze the following student's speech transcription:
    "{transcription}"{topic_context}

    Evaluate based on confidence, fluency, and professional impact.
    
    Return ONLY a JSON object with these EXACT fields and numeric types:
    - ai_feedback: (string, exactly two short coaching sentences)
    - fluency: (int 0-100) -> Smoothness of speech
    - pronunciation: (int 0-100) -> Accuracy of word pronunciation
    - clarity: (int 0-100) -> How clearly ideas are expressed
    - vocabulary: (int 0-100) -> Word variety and richness
    - speech_rate: (int 0-100) -> Speed of speaking (50 is ideal, but score 0-100 as quality)
    - expression: (int 0-100) -> Emotion, tone, confidence
    - filler_words: (int, count of words like 'um', 'uh', 'like', 'you know')
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
        
        # Calculate Confidence Index based on the weighted formula
        F = float(data.get("fluency", 0))
        P = float(data.get("pronunciation", 0))
        C = float(data.get("clarity", 0))
        V = float(data.get("vocabulary", 0))
        S = float(data.get("speech_rate", 0))
        E = float(data.get("expression", 0))
        
        ci_val = 0.214 * F + 0.214 * P + 0.214 * C + 0.143 * V + 0.143 * S + 0.071 * E
        
        # Map back to legacy schema fields for frontend
        eval_data = {
            "ai_feedback": data.get("ai_feedback", ""),
            "speech_clarity": _clamp(F),            # Maps to Fluency on frontend
            "filler_words": int(data.get("filler_words", 0)),
            "pace": _clamp(S),                      # Maps to Pace on frontend
            "grammar_score": _clamp(V),             # Maps to Grammar on frontend
            "confidence_score": _clamp(ci_val),     # Calculated using the 6 features
            "pronunciation_score": _clamp(P),
            "content_clarity": _clamp(C),
            "expression_score": _clamp(E),
            "feedback_source": "gemini"
        }
        
        print("Gemini Evaluation:", eval_data)

        return {
            "ai_evaluation": eval_data
        }

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return _build_local_feedback(transcription, reason=str(e))
