"""
test_ai_feedback.py
===================
End-to-end test for the AI speech pipeline:

  Stage 1 — Generate a realistic speech audio sample via OpenAI TTS
  Stage 2 — Transcribe with Whisper
  Stage 3 — Generate coaching feedback with GPT-4o-mini
  Stage 4 — Validate the response schema and score ranges
  Stage 5 — Print a detailed human-readable report

Run with:
  cd zenvoco-backend
  python test_ai_feedback.py
"""

import asyncio
import os
import sys
import json
import time

# ── Make sure we can import from this project ──────────────────────────────
sys.path.insert(0, os.path.dirname(__file__))

from openai import AsyncOpenAI
from config.settings import settings
from services.speech_service import process_audio_transcription, process_generative_feedback

# ── Config ─────────────────────────────────────────────────────────────────
TMP_AUDIO = "uploads/test_tts_sample.mp3"
os.makedirs("uploads", exist_ok=True)

# A realistic 30-second student speech — good content but with a few flaws
SAMPLE_SPEECH = (
    "Good morning. My name is Anil Varma, and I am a final-year Computer Science student "
    "at basically VIT Vellore. Um, I have been working on AI and full-stack development "
    "for the past two years, like, interning at two startups where I built production-level "
    "web applications. My strongest skill is, uh, translating complex backend logic into "
    "clean user interfaces. I am passionate about, you know, solving real problems at the "
    "intersection of AI and product design. My goal is to contribute meaningfully to an "
    "innovative team and, um, grow as an engineer. Thank you."
)

REQUIRED_FIELDS = [
    "ai_feedback",
    "speech_clarity",
    "filler_words",
    "pace",
    "grammar_score",
    "confidence_score",
]

# ── Helpers ────────────────────────────────────────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

def ok(msg):   print(f"  {GREEN}✓{RESET} {msg}")
def fail(msg): print(f"  {RED}✗ {msg}{RESET}")
def info(msg): print(f"  {CYAN}→{RESET} {msg}")
def header(msg): print(f"\n{BOLD}{YELLOW}{'─'*60}{RESET}\n{BOLD} {msg}{RESET}\n{BOLD}{YELLOW}{'─'*60}{RESET}")

# ── Tests ──────────────────────────────────────────────────────────────────
async def stage1_generate_audio():
    """Use OpenAI TTS to create a realistic audio sample."""
    header("STAGE 1 — Generating TTS Audio Sample")
    info(f"Speech text ({len(SAMPLE_SPEECH)} chars):\n  \"{SAMPLE_SPEECH[:100]}…\"")

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    t0 = time.time()

    response = await client.audio.speech.create(
        model="tts-1",
        voice="alloy",       # natural, clear voice
        input=SAMPLE_SPEECH,
    )

    with open(TMP_AUDIO, "wb") as f:
        f.write(response.content)

    size_kb = os.path.getsize(TMP_AUDIO) / 1024
    elapsed = round(time.time() - t0, 2)

    ok(f"Audio generated in {elapsed}s → {TMP_AUDIO} ({size_kb:.1f} KB)")
    return TMP_AUDIO


async def stage2_transcribe(audio_path: str):
    """Run Whisper transcription on the generated audio."""
    header("STAGE 2 — Whisper Transcription")
    t0 = time.time()

    transcription = await process_audio_transcription(audio_path)
    elapsed = round(time.time() - t0, 2)

    if not transcription or transcription == "Audio transcription failed.":
        fail(f"Transcription failed: {transcription}")
        return None

    ok(f"Transcribed in {elapsed}s")
    info(f"Result: \"{transcription[:200]}{'…' if len(transcription) > 200 else ''}\"")

    # Basic sanity check — should contain something from the original speech
    keywords = ["Anil", "VIT", "AI", "web", "student"]
    found = [kw for kw in keywords if kw.lower() in transcription.lower()]
    if found:
        ok(f"Keywords found in transcription: {found}")
    else:
        print(f"  {YELLOW}⚠ No expected keywords found — check transcription quality{RESET}")

    return transcription


async def stage3_generate_feedback(transcription: str):
    """Run GPT-4o-mini feedback generation."""
    header("STAGE 3 — AI Feedback Generation (GPT-4o-mini)")
    t0 = time.time()

    feedback = await process_generative_feedback(transcription)
    elapsed  = round(time.time() - t0, 2)

    ok(f"Feedback generated in {elapsed}s")
    return feedback


def stage4_validate_schema(feedback: dict):
    """Validate that all required fields are present and in correct ranges."""
    header("STAGE 4 — Schema & Value Validation")

    ai = feedback.get("ai_evaluation", {})
    all_ok = True

    # Check every required field exists
    for field in REQUIRED_FIELDS:
        if field in ai:
            ok(f"Field present: '{field}'")
        else:
            fail(f"Missing field: '{field}'")
            all_ok = False

    # Validate numeric score ranges
    score_fields = ["speech_clarity", "pace", "grammar_score", "confidence_score"]
    for field in score_fields:
        val = ai.get(field)
        if val is None:
            continue
        try:
            v = float(val)
            if 0 <= v <= 100:
                ok(f"{field} = {v} (valid 0–100 range)")
            else:
                fail(f"{field} = {v} — OUT OF RANGE (expected 0–100)")
                all_ok = False
        except (TypeError, ValueError):
            fail(f"{field} = {val!r} — NOT A NUMBER")
            all_ok = False

    # filler_words should be a non-negative integer
    fw = ai.get("filler_words")
    if fw is not None:
        try:
            v = int(fw)
            if v >= 0:
                ok(f"filler_words = {v} (valid non-negative int)")
            else:
                fail(f"filler_words = {v} — NEGATIVE")
                all_ok = False
        except (TypeError, ValueError):
            fail(f"filler_words = {fw!r} — NOT AN INT")
            all_ok = False

    # ai_feedback should be a non-empty string
    fb = ai.get("ai_feedback", "")
    if isinstance(fb, str) and len(fb.strip()) > 10:
        ok(f"ai_feedback is a valid string ({len(fb)} chars)")
    else:
        fail(f"ai_feedback is too short or not a string: {fb!r}")
        all_ok = False

    # Sanity check — filler word count should roughly match obvious fillers in input
    # (Whisper may normalize "uh"/"um" so we just check it's plausible)
    fw_count = ai.get("filler_words", 0)
    SPEECH_FILLERS = SAMPLE_SPEECH.lower().count("uh") + SAMPLE_SPEECH.lower().count("um") + \
                     SAMPLE_SPEECH.lower().count("like,") + SAMPLE_SPEECH.lower().count("basically") + \
                     SAMPLE_SPEECH.lower().count("you know")
    info(f"Filler words in original text: ~{SPEECH_FILLERS}, AI detected: {fw_count}")

    return all_ok, ai


def stage5_report(ai: dict):
    """Print a human-readable summary."""
    header("STAGE 5 — Full AI Feedback Report")

    metrics = [
        ("Confidence Score", "confidence_score", "%"),
        ("Speech Clarity (Fluency)", "speech_clarity", "%"),
        ("Pace", "pace", "%"),
        ("Grammar Score", "grammar_score", "%"),
        ("Filler Words", "filler_words", ""),
    ]

    for label, key, unit in metrics:
        val = ai.get(key, "N/A")
        print(f"  {CYAN}{label:<28}{RESET} {BOLD}{val}{unit}{RESET}")

    print(f"\n  {YELLOW}AI Feedback:{RESET}")
    print(f"  {ai.get('ai_feedback', 'N/A')}")


# ── Main ───────────────────────────────────────────────────────────────────
async def main():
    print(f"\n{BOLD}{'═'*60}")
    print(" Zenvoco AI Feedback Pipeline — End-to-End Test")
    print(f"{'═'*60}{RESET}")

    if not settings.OPENAI_API_KEY:
        print(f"{RED}✗ OPENAI_API_KEY not set in .env — cannot run live test.{RESET}")
        sys.exit(1)

    print(f"  API key: {settings.OPENAI_API_KEY[:12]}…{settings.OPENAI_API_KEY[-4:]}")

    passed = True

    try:
        # Stage 1 — TTS
        audio_path = await stage1_generate_audio()

        # Stage 2 — Whisper
        transcription = await stage2_transcribe(audio_path)
        if not transcription:
            raise RuntimeError("Transcription returned empty/failed result")

        # Stage 3 — GPT feedback
        feedback = await stage3_generate_feedback(transcription)

        # Stage 4 — Schema validation
        schema_ok, ai = stage4_validate_schema(feedback)
        if not schema_ok:
            passed = False

        # Stage 5 — Human report
        stage5_report(ai)

    except Exception as e:
        print(f"\n{RED}{BOLD}FATAL ERROR: {e}{RESET}")
        passed = False
    finally:
        # Cleanup
        if os.path.exists(TMP_AUDIO):
            os.remove(TMP_AUDIO)
            print(f"\n  {GREEN}✓ Temp file cleaned up{RESET}")

    # Final verdict
    print(f"\n{BOLD}{'═'*60}{RESET}")
    if passed:
        print(f"{GREEN}{BOLD} ✅  ALL STAGES PASSED — AI feedback pipeline is working correctly.{RESET}")
    else:
        print(f"{RED}{BOLD} ❌  SOME STAGES FAILED — review the output above.{RESET}")
    print(f"{BOLD}{'═'*60}{RESET}\n")

    return passed


if __name__ == "__main__":
    result = asyncio.run(main())
    sys.exit(0 if result else 1)
