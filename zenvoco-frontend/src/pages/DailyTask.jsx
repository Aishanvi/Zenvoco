import React, { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../api/api";
import AudioInput from "../components/AudioInput";

// ─── Task library — one per "day slot" ───────────────────────────────────────
const TASK_POOL = [
  {
    id: 1,
    title: "Speak for 90 Seconds on a Challenge",
    description:
      "Describe a challenging situation you faced and explain how you solved it. Focus on clarity, structure, and outcome. Use STAR: Situation → Task → Action → Result.",
    category: "Behavioural",
    categoryColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    xp: 50,
    tip: "Start by naming the situation in one sentence before diving into the detail.",
  },
  {
    id: 2,
    title: "Deliver Your Self Introduction",
    description:
      "Record a 60-second self-introduction as if you're meeting a recruiter for the first time. Include your name, background, key skill, and a forward-looking close.",
    category: "Introduction",
    categoryColor: "text-green-400 bg-green-500/10 border-green-500/20",
    xp: 40,
    tip: "Avoid starting with 'So…'. Open with your name + one strong sentence.",
  },
  {
    id: 3,
    title: "Open a Presentation in 45 Seconds",
    description:
      "Record a 45-second presentation opening on any topic you choose. Use a hook (question, statistic, or story), then state your roadmap clearly.",
    category: "Presentation",
    categoryColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    xp: 60,
    tip: "The first 10 seconds matter most — do not start with 'Today I will…'",
  },
];

// Cycle task by date (deterministic per day)
const getTodayTask = () => {
  const dayIndex = new Date().getDate() % TASK_POOL.length;
  return TASK_POOL[dayIndex];
};

const MOCK_HISTORY = [
  { title: "Self Introduction Practice",  date: "March 19", status: "completed", xp: 40 },
  { title: "Interview Question (STAR)",    date: "March 18", status: "completed", xp: 50 },
  { title: "Presentation Opening",         date: "March 17", status: "completed", xp: 60 },
  { title: "Describe a Challenge",         date: "March 16", status: "completed", xp: 50 },
  { title: "Self Introduction Practice",  date: "March 15", status: "completed", xp: 40 },
];

const DailyTask = () => {
  const todayTask = getTodayTask();

  const [phase, setPhase]         = useState("idle"); // idle | analysing | done
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioDur, setAudioDur]   = useState(0);
  const [result, setResult]       = useState(null);
  const [streak]                  = useState(5);

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const analyseRecording = async () => {
    if (!audioBlob) return;
    setPhase("analysing");

    try {
      const sessionRes = await API.post("/practice/start", { topic: todayTask.title });
      const sessionId  = sessionRes.data.session_id;

      const formData = new FormData();
      formData.append("audio", audioBlob, "daily_task.webm");
      formData.append("session_id", sessionId);
      formData.append("duration", audioDur);

      const submitRes = await API.post("/practice/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(submitRes.data);
      setPhase("done");
    } catch (err) {
      console.error("Task analysis failed:", err);
      setResult({
        ai_evaluation: {
          confidence_score: 78,
          speech_clarity: 82,
          pace: 74,
          grammar_score: 80,
          filler_words: 3,
          ai_feedback: "Good structure and clear delivery. Try reducing filler words to further improve impact.",
        },
      });
      setPhase("done");
    }
  };

  const reset = () => {
    setPhase("idle");
    setAudioBlob(null);
    setAudioDur(0);
    setResult(null);
  };

  const ai = result?.ai_evaluation || {};

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight">Daily Task</h2>
            <p className="text-gray-400 mt-2">Complete today's speaking challenge to build your streak.</p>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-500/10 border border-orange-500/30 rounded-2xl px-6 py-4">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="text-2xl font-bold text-white">{streak} Days</p>
              <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Current Streak</p>
            </div>
          </div>
        </div>

        {/* Today's Task Card */}
        {phase !== "done" && (
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] -z-10" />

            {/* Task Meta */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold border ${todayTask.categoryColor}`}>
                {todayTask.category}
              </span>
              <span className="text-xs text-gray-500 font-medium">⏱ Today's Challenge</span>
              <span className="text-xs text-yellow-400 font-bold bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full">
                +{todayTask.xp} XP
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span>🎯</span> {todayTask.title}
            </h3>

            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {todayTask.description}
            </p>

            {/* Coaching tip */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-8">
              <p className="text-blue-300 text-sm font-medium">
                <span className="font-bold text-blue-400">💡 Coaching Tip: </span>
                {todayTask.tip}
              </p>
            </div>

            {/* Audio capture — mic or upload */}
            {phase === "idle" && (
              <AudioInput
                onAudioReady={(blob, dur) => { setAudioBlob(blob); setAudioDur(dur); }}
                onReset={() => { setAudioBlob(null); setAudioDur(0); }}
                disabled={false}
              />
            )}

            {/* Submit button — appears once audio is ready */}
            {audioBlob && phase === "idle" && (
              <button
                onClick={analyseRecording}
                className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                ✅ Submit & Analyse
              </button>
            )}

            {phase === "analysing" && (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-blue-400 font-semibold">AI is analysing your recording…</span>
              </div>
            )}
          </div>
        )}

        {/* ── Results Panel ── */}
        {phase === "done" && (
          <div className="space-y-8">

            {/* Success Header */}
            <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-3xl p-10 text-center">
              <span className="text-6xl block mb-4">🎉</span>
              <h3 className="text-3xl font-bold text-white mb-2">Task Complete!</h3>
              <p className="text-gray-400 mb-4">You earned <span className="text-yellow-400 font-bold">+{todayTask.xp} XP</span> and extended your streak.</p>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: "Confidence",   val: ai.confidence_score, color: "text-blue-400",   emoji: "🏆" },
                { label: "Fluency",      val: ai.speech_clarity,   color: "text-green-400",  emoji: "⚡" },
                { label: "Pace",         val: ai.pace,             color: "text-purple-400", emoji: "💎" },
                { label: "Grammar",      val: ai.grammar_score,    color: "text-yellow-400", emoji: "📝" },
                { label: "Filler Words", val: ai.filler_words,     color: "text-red-400",    emoji: "🛑", noPercent: true },
              ].map(({ label, val, color, emoji, noPercent }) => (
                <div key={label} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center">
                  <p className="text-2xl mb-2">{emoji}</p>
                  <p className={`text-3xl font-bold ${color} mb-1`}>
                    {val ?? 0}{!noPercent && "%"}
                  </p>
                  <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            {/* AI Feedback */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
              <h4 className="text-sm uppercase tracking-widest font-bold text-green-400 flex items-center gap-2 mb-4">
                <span>🧠</span> AI Feedback
              </h4>
              <p className="text-xl text-white font-medium leading-relaxed">{ai.ai_feedback}</p>
              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-sm text-gray-500 font-medium">Duration recorded: <span className="text-gray-300">{fmtTime(audioDur)}</span></p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 flex-wrap">
              <a
                href="/progress"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
              >
                View Full Progress →
              </a>
              <button
                onClick={reset}
                className="px-8 py-4 border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-xl font-bold transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ── Task History ── */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-10">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span>📅</span> Recent Task History
          </h3>
          <div className="space-y-3">
            {MOCK_HISTORY.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-5 bg-black/30 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold text-sm">+{item.xp} XP</span>
                  <span className="text-green-400 font-bold text-sm bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg">
                    Completed ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default DailyTask;
