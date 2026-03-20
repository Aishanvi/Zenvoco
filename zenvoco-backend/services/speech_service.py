from openai import AsyncOpenAI
from config.settings import settings
import json
import re

# Initialize OpenAI client
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

FILLER_WORD_PATTERN = re.compile(
    r"\b(um|uh|like|you know|basically|actually|literally|so)\b",
    re.IGNORECASE,
)


def _clamp(value: float, low: int = 0, high: int = 100) -> int:
    return max(low, min(high, int(round(value))))


def _build_local_feedback(transcription: str, reason: str | None = None) -> dict:
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
                "ai_feedback": "We could not extract enough speech content to coach this response. Please retry with a clearer recording and check microphone input.",
                "speech_clarity": 0,
                "filler_words": 0,
                "pace": 0,
                "grammar_score": 0,
                "confidence_score": 0,
                "feedback_source": "local_fallback",
                "fallback_reason": reason or "missing_transcription",
            }
        }

    feedback_parts = []
    if filler_words >= 4:
        feedback_parts.append("Your ideas are coming through, but filler words are reducing fluency. Pause briefly instead of using words like 'um' or 'like'.")
    else:
        feedback_parts.append("Your response is fairly clear and easy to follow. Keep the same structure and make your key points slightly more deliberate.")

    if confidence_score < 70:
        feedback_parts.append("Project more confidence by slowing down at the start of each sentence and ending statements cleanly.")
    elif grammar_score < 75:
        feedback_parts.append("Tighten a few sentence transitions so the delivery sounds more polished and professional.")
    else:
        feedback_parts.append("Your delivery sounds reasonably confident. A bit more energy and sharper phrasing will make it more persuasive.")

    return {
        "ai_evaluation": {
            "ai_feedback": " ".join(feedback_parts),
            "speech_clarity": speech_clarity,
            "filler_words": filler_words,
            "pace": pace,
            "grammar_score": grammar_score,
            "confidence_score": confidence_score,
            "feedback_source": "local_fallback",
            "fallback_reason": reason or "openai_unavailable",
        }
    }


# AUDIO -> TEXT (WHISPER)
async def process_audio_transcription(file_path: str) -> str:
    if not settings.OPENAI_API_KEY:
        return "This is a mock transcription for testing."

    try:
        with open(file_path, "rb") as audio_file:
            transcript = await client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )

        print("Transcription:", transcript.text)
        return transcript.text

    except Exception as e:
        print(f"Whisper error: {e}")
        return "Audio transcription failed."


# TEXT -> AI FEEDBACK
async def process_generative_feedback(transcription: str) -> dict:
    if not settings.OPENAI_API_KEY:
        return _build_local_feedback(transcription, reason="missing_api_key")

    prompt = f"""
    Analyze the following speech from a student:

    \"{transcription}\"

    Return ONLY a JSON object with:
    - ai_feedback (2 short coaching sentences)
    - speech_clarity (0-100)
    - filler_words (count)
    - pace (0-100)
    - grammar_score (0-100)
    - confidence_score (0-100)
    """

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert communication coach."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content or "{}"
        data = json.loads(content)

        print("AI Evaluation:", data)

        return {
            "ai_evaluation": {
                **data,
                "feedback_source": "openai"
            }
        }

    except Exception as e:
        print("AI error:", e)
        return _build_local_feedback(transcription, reason=str(e))
