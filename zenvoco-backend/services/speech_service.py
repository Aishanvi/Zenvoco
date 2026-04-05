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

def _calculate_lexical_diversity(text: str) -> float:
    words = re.findall(r"\b[\w']+\b", text.lower())
    if not words:
        return 0.0
    return len(set(words)) / len(words)

def _calculate_ci(f_score: float, p_score: float, v_score: float, c_score: float, s_score: float, e_score: float) -> int:
    """
    Weighted Confidence Index Formula (IEEE/ChatGPT standard):
    F (Fluency): 0.214
    P (Pronunciation): 0.214
    V (Vocabulary): 0.214
    C (Clarity/Coherence): 0.143
    S (Stability/Pace): 0.143
    E (Engagement/Expression): 0.071
    """
    ci_val = (0.214 * f_score) + (0.214 * p_score) + (0.214 * v_score) + \
             (0.143 * c_score) + (0.143 * s_score) + (0.071 * e_score)
    return _clamp(ci_val)

def _build_local_feedback(transcription_dict: dict, reason: str | None = None) -> dict:
    """Fallback logic if LLM fails"""
    text = transcription_dict.get("text", "").strip()
    words = re.findall(r"\b[\w']+\b", text)
    sentences = [part.strip() for part in re.split(r"[.!?]+", text) if part.strip()]
    filler_words = len(FILLER_WORD_PATTERN.findall(text))

    word_count = len(words)
    avg_sentence_length = word_count / max(len(sentences), 1)
    
    # Components for CI
    F = transcription_dict.get("fluency_score", 70) 
    P = transcription_dict.get("confidence", 0.8) * 100
    V = transcription_dict.get("lexical_diversity", 0.5) * 100
    C = _clamp(90 - max(avg_sentence_length - 20, 0) * 1.5)
    S = _clamp(75 - filler_words * 5)
    E = _clamp(80 - filler_words * 2)

    confidence_score = _calculate_ci(F, P, V, C, S, E)

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

# STEP 1: AUDIO -> METADATA (AssemblyAI)
async def process_audio_transcription(file_path: str) -> dict:
    """Uses AssemblyAI to transcribe audio and extract metrics (WPM, Confidence, etc.)"""
    default_result = {"text": "Audio transcription failed.", "confidence": 0.0, "duration": 0, "word_count": 0, "wpm": 0, "lexical_diversity": 0, "fluency_score": 0}
    
    if not os.path.exists(file_path):
        return {**default_result, "text": "Audio file not found."}

    if not settings.ASSEMBLYAI_API_KEY:
        return {**default_result, "text": "AssemblyAI Key missing."}

    try:
        loop = asyncio.get_event_loop()
        config = aai.TranscriptionConfig(speech_models=["universal-2"], disfluencies=True)
        transcriber = aai.Transcriber(config=config)
        transcript = await loop.run_in_executor(None, lambda: transcriber.transcribe(file_path))
        
        if transcript.status == aai.TranscriptStatus.error:
            return default_result

        text = transcript.text.strip() if transcript.text else ""
        words = transcript.words or []
        duration_sec = transcript.audio_duration or 0
        duration_min = duration_sec / 60 if duration_sec > 0 else 0
        
        wpm = (len(words) / duration_min) if duration_min > 0 else 0
        # Fluency Score based on ideal WPM (130-160 range)
        fluency_score = _clamp((wpm / 160) * 100) if wpm < 160 else _clamp(100 - (wpm-160)*0.5)

        return {
            "text": text if text else "No speech detected.",
            "confidence": transcript.confidence or 0.0,
            "duration": duration_sec,
            "word_count": len(words),
            "wpm": round(wpm, 2),
            "lexical_diversity": round(_calculate_lexical_diversity(text), 2),
            "fluency_score": fluency_score
        }

    except Exception as e:
        print(f"AssemblyAI processing error: {e}")
        return default_result

# STEP 2: METADATA -> AI FEEDBACK (Google Gemini)
async def process_generative_feedback(transcription_data: dict | str, topic: str = None) -> dict:
    """Uses Google Gemini API + AssemblyAI metrics to generate fixed formula confidence index"""
    
    # Handle cases where transcription_data might still be a raw string
    if isinstance(transcription_data, str):
        transcription_data = {
            "text": transcription_data,
            "confidence": 0.85, # Default fallback
            "lexical_diversity": _calculate_lexical_diversity(transcription_data),
            "fluency_score": 80,
            "wpm": 140
        }

    text = transcription_data.get("text", "")

    if not settings.GEMINI_API_KEY:
        return _build_local_feedback(transcription_data, reason="missing_gemini_key")

    topic_context = f"\n\nThe student was asked to speak about this topic/question:\n'{topic}'\nEvaluate how well they addressed this specific topic." if topic else ""

    prompt = f"""
    You are an expert English communication coach.
    Analyze this student's speech transcription: "{text}"{topic_context}

    Evaluate based on coherence, vocabulary richness, and emotional engagement.
    
    Return ONLY a JSON object with these EXACT fields:
    - ai_feedback: (string, exactly two short coaching sentences)
    - coherence: (int 0-100) -> Logical flow and structure
    - vocabulary_richness: (int 0-100) -> Variety and level of words
    - engagement: (int 0-100) -> Emotional tone and confidence level
    - stability: (int 0-100) -> How steady and professional the delivery sounds
    - filler_words_count: (int, total count of 'um', 'uh', 'like', etc.)
    """

    try:
        response = await asyncio.to_thread(lambda: gemini_model.generate_content(prompt))
        content = response.text.strip()
        if content.startswith("```json"): content = content[7:-3].strip()
        elif content.startswith("```"): content = content[3:-3].strip()

        data = json.loads(content)
        
        # ─── REAL FORMULA INTEGRATION (IEEE Standard) ────────────────────────
        F = float(transcription_data.get("fluency_score", 0))
        P = float(transcription_data.get("confidence", 0)) * 100
        V = (float(transcription_data.get("lexical_diversity", 0)) * 50) + (float(data.get("vocabulary_richness", 0)) * 0.5)
        C = float(data.get("coherence", 0))
        S = float(data.get("stability", 0))
        E = float(data.get("engagement", 0))
        
        # Apply the weighted formula from ChatGPT Link
        confidence_score = _calculate_ci(F, P, V, C, S, E)
        
        eval_data = {
            "ai_feedback": data.get("ai_feedback", ""),
            "speech_clarity": _clamp(F),            # Maps to Fluency
            "filler_words": int(data.get("filler_words_count", 0)),
            "pace": _clamp(S),                      # Maps to Stability/Pace
            "grammar_score": _clamp(V),             # Maps to Vocabulary
            "confidence_score": confidence_score,   
            "pronunciation_score": _clamp(P),
            "content_clarity": _clamp(C),
            "expression_score": _clamp(E),
            "feedback_source": "gemini_hybrid"
        }
        
        return {"ai_evaluation": eval_data}

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return _build_local_feedback(transcription_data, reason=str(e))
