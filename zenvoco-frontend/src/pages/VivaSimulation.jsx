import React, { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../api/api";
import AudioInput from "../components/AudioInput";

// ─── Fixed question bank (4 questions per session) ───────────────────────────
const VIVA_QUESTIONS = [
  "Tell me about a time you had to learn a new technology quickly to complete a project.",
  "Describe a situation where you had to collaborate with a difficult team member. How did you handle it?",
  "Walk me through a project you're especially proud of and explain the impact it had.",
  "How do you handle tight deadlines and competing priorities? Give a specific example.",
];

const TOTAL_QUESTIONS = VIVA_QUESTIONS.length;

// ─── Initial blank metrics state ─────────────────────────────────────────────
const BLANK_METRICS = {
  speech_clarity: "-",
  confidence_score: "-",
  pace: "-",
  filler_words: "-",
};

const VivaSimulation = () => {
  const [started, setStarted]       = useState(false);
  const [currentQ, setCurrentQ]     = useState(0);
  const [audioBlob, setAudioBlob]   = useState(null);
  const [processing, setProcessing] = useState(false);
  const [finished, setFinished]     = useState(false);
  const [inputKey, setInputKey]     = useState(0); // force AudioInput remount between questions

  const [allMetrics, setAllMetrics]   = useState([]);
  const [liveMetrics, setLiveMetrics] = useState(BLANK_METRICS);

  // ─── Analyse current answer then advance to next question ─────────────────
  const submitAnswer = async () => {
    if (!audioBlob) return;
    setProcessing(true);

    let metrics = { ...BLANK_METRICS };

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "answer.webm");

      const response = await API.post("/speech/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { feedback_object } = response.data;
      if (feedback_object?.ai_evaluation) {
        metrics = feedback_object.ai_evaluation;
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    }

    // Store this question's metrics
    const updated = [...allMetrics, { question: VIVA_QUESTIONS[currentQ], metrics }];
    setAllMetrics(updated);
    setLiveMetrics(metrics);
    setAudioBlob(null);

    const nextQ = currentQ + 1;
    if (nextQ >= TOTAL_QUESTIONS) {
      // All questions answered — show summary (keep liveMetrics showing last answer)
      setFinished(true);
    } else {
      setCurrentQ(nextQ);
      setLiveMetrics(BLANK_METRICS); // reset only when advancing to next question
      setInputKey((k) => k + 1);    // remount AudioInput for the next question
    }

    setProcessing(false);
  };

  // ─── Reset entire session ─────────────────────────────────────────────────
  const resetSession = () => {
    setStarted(false);
    setCurrentQ(0);
    setAudioBlob(null);
    setProcessing(false);
    setFinished(false);
    setAllMetrics([]);
    setLiveMetrics(BLANK_METRICS);
    setInputKey((k) => k + 1); // remount AudioInput
  };

  // ─── Derived helpers ──────────────────────────────────────────────────────
  const avgScore = (key) => {
    const vals = allMetrics.map((m) => Number(m.metrics[key]) || 0);
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Page Header */}
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">Viva Simulation</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Test your skills in a realistic AI mock interview session.</p>
        </div>

        {/* ── STATE 1: Intro splash ── */}
        {!started && !finished && (
          <div className="bg-gradient-to-br from-pink-500/10 to-transparent backdrop-blur-xl border border-pink-500/20 rounded-3xl p-16 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] group-hover:bg-pink-500/20 transition-all -z-10" />
            <span className="text-7xl mb-8 block">🔥</span>
            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Ready for the heat?</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              You will be asked {TOTAL_QUESTIONS} questions by an AI interviewer. Record your answer to each, then submit to advance.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-5 bg-pink-600 hover:bg-pink-500 text-gray-900 dark:text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:-translate-y-1"
            >
              Start Simulation
            </button>
          </div>
        )}

        {/* ── STATE 2: Active interview ── */}
        {started && !finished && (
          <div className="space-y-8">

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium">
                <span>Question {currentQ + 1} of {TOTAL_QUESTIONS}</span>
                <span>{Math.round(((currentQ) / TOTAL_QUESTIONS) * 100)}% complete</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${(currentQ / TOTAL_QUESTIONS) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] group-hover:bg-blue-500/20 transition-all -z-10" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                  <span>🤖</span> AI Interviewer
                </h3>
                <span className="bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 px-4 py-1 rounded-full text-sm font-medium">
                  Question {currentQ + 1} of {TOTAL_QUESTIONS}
                </span>
              </div>
              <p className="text-2xl font-medium text-gray-900 dark:text-white leading-relaxed">
                "{VIVA_QUESTIONS[currentQ]}"
              </p>
            </div>

            {/* Audio capture — mic or upload */}
            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                {processing
                  ? "Analysing your answer…"
                  : audioBlob
                  ? "Answer ready. Submit when ready, or clear to redo."
                  : "Record your answer with the mic, or upload a file."}
              </p>

              {!processing && (
                <AudioInput
                  key={inputKey}
                  onAudioReady={(blob) => setAudioBlob(blob)}
                  onReset={() => setAudioBlob(null)}
                  disabled={processing}
                />
              )}

              {processing && (
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-green-400 font-semibold">Analysing…</span>
                </div>
              )}

              <div className="flex justify-center gap-6 flex-wrap">
                <button
                  onClick={submitAnswer}
                  disabled={!audioBlob || processing}
                  className="px-8 py-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 dark:text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-1"
                >
                  {processing
                    ? "Analysing..."
                    : currentQ === TOTAL_QUESTIONS - 1
                    ? "Submit Final Answer"
                    : "Submit & Next Question"}
                </button>
                <button
                  onClick={resetSession}
                  className="px-8 py-4 bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:bg-gray-800 text-red-400 hover:text-red-300 rounded-xl font-bold transition-all"
                >
                  End Session
                </button>
              </div>
            </div>

            {/* Live Performance Metrics (updates after each answer) */}
            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <span>📊</span> Last Answer Metrics
              </h3>
              <p className="text-gray-500 text-sm mb-6">Updates after you submit each answer.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Fluency",     key: "speech_clarity",   color: "text-green-400" },
                  { label: "Pace",        key: "pace",             color: "text-blue-400"  },
                  { label: "Confidence",  key: "confidence_score", color: "text-purple-400"},
                  { label: "Filler Words",key: "filler_words",     color: "text-red-400",  noPercent: true },
                ].map(({ label, key, color, noPercent }) => (
                  <div key={key} className="bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 uppercase tracking-wider font-semibold">{label}</p>
                    <p className={`text-4xl font-bold ${color}`}>
                      {liveMetrics[key]}
                      {!noPercent && liveMetrics[key] !== "-" && <span className="text-xl">%</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── STATE 3: Session complete — summary ── */}
        {finished && (
          <div className="space-y-10">

            {/* Header */}
            <div className="bg-gradient-to-br from-green-500/10 to-transparent backdrop-blur-xl border border-green-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -z-10" />
              <span className="text-7xl mb-6 block">🎓</span>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Session Complete!</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">You answered all {TOTAL_QUESTIONS} questions. Here's how you did overall.</p>
            </div>

            {/* Overall average scores */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Avg Confidence",  key: "confidence_score", color: "text-blue-400",   emoji: "🏆" },
                { label: "Avg Fluency",     key: "speech_clarity",   color: "text-green-400",  emoji: "⚡" },
                { label: "Avg Pace",        key: "pace",             color: "text-purple-400", emoji: "💎" },
                { label: "Avg Fillers",     key: "filler_words",     color: "text-red-400",    emoji: "🛑", noPercent: true },
              ].map(({ label, key, color, emoji, noPercent }) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center">
                  <p className="text-3xl mb-3">{emoji}</p>
                  <p className={`text-4xl font-bold ${color} mb-2`}>
                    {avgScore(key)}{!noPercent && <span className="text-xl">%</span>}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-bold uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>

            {/* Per-question breakdown */}
            <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-10">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span>📜</span> Question-by-Question Breakdown
              </h3>
              <div className="space-y-6">
                {allMetrics.map((entry, i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-black/20">
                    <p className="text-sm font-bold text-pink-400 uppercase tracking-widest mb-2">
                      Question {i + 1}
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium mb-4 italic">"{entry.question}"</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      {[
                        { label: "Confidence", val: entry.metrics.confidence_score, color: "text-blue-400" },
                        { label: "Fluency",    val: entry.metrics.speech_clarity,   color: "text-green-400" },
                        { label: "Pace",       val: entry.metrics.pace,             color: "text-purple-400" },
                        { label: "Fillers",    val: entry.metrics.filler_words,     color: "text-red-400", noPercent: true },
                      ].map(({ label, val, color, noPercent }) => (
                        <div key={label} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                          <p className="text-gray-500 text-xs uppercase font-bold mb-1">{label}</p>
                          <p className={`text-2xl font-bold ${color}`}>
                            {val ?? "-"}{!noPercent && val !== "-" && val != null && "%"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-6 flex-wrap">
              <button
                onClick={resetSession}
                className="px-10 py-5 bg-pink-600 hover:bg-pink-500 text-gray-900 dark:text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:-translate-y-1"
              >
                Try Again
              </button>
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default VivaSimulation;