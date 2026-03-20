import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../api/api";
import AudioInput from "../components/AudioInput";

// ─── Practice topic bank ──────────────────────────────────────────────────────
const TOPICS = [
  {
    label: "Describe a challenging situation you faced and how you handled it.",
    category: "Behavioural",
    color: "border-blue-500/50 bg-blue-500/5",
    badge: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    difficulty: "Moderate",
  },
  {
    label: "Give a 60-second self-introduction for a professional setting.",
    category: "Introduction",
    color: "border-green-500/50 bg-green-500/5",
    badge: "text-green-400 bg-green-500/10 border-green-500/20",
    difficulty: "Beginner",
  },
  {
    label: "Open a 5-minute presentation on a technology you're passionate about.",
    category: "Presentation",
    color: "border-purple-500/50 bg-purple-500/5",
    badge: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    difficulty: "Advanced",
  },
  {
    label: "Describe a project you're proud of and explain the impact it had.",
    category: "Project Pitch",
    color: "border-yellow-500/50 bg-yellow-500/5",
    badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    difficulty: "Moderate",
  },
  {
    label: "Answer: 'Where do you see yourself in 5 years?' clearly and confidently.",
    category: "Career",
    color: "border-pink-500/50 bg-pink-500/5",
    badge: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    difficulty: "Beginner",
  },
];

const DIFFICULTY_COLOR = {
  Beginner:  "text-green-400",
  Moderate:  "text-yellow-400",
  Advanced:  "text-red-400",
};

const GuidedPractice = () => {
  const navigate = useNavigate();

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [audioBlob, setAudioBlob]         = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [uploading, setUploading]         = useState(false);

  const selectTopic = (topic) => {
    setSelectedTopic(topic);
    setAudioBlob(null);
    setAudioDuration(0);
  };

  const handleAudioReady = (blob, dur) => {
    setAudioBlob(blob);
    setAudioDuration(dur);
  };

  // ── Submit to API ─────────────────────────────────────────────────────────
  const submitAudio = async () => {
    if (!audioBlob) return;
    setUploading(true);
    try {
      const sessionRes = await API.post("/practice/start", { topic: selectedTopic.label });
      const sessionId  = sessionRes.data.session_id;

      const formData = new FormData();
      formData.append("audio", audioBlob, "practice.webm");
      formData.append("session_id", sessionId);
      formData.append("duration", audioDuration || 1);

      const response = await API.post("/practice/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/result", { state: response.data });
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Analysis failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight">Guided Practice</h2>
            <p className="text-gray-400 mt-2">
              {!selectedTopic
                ? "Choose a topic, record your response, and get detailed AI feedback."
                : `Topic: ${selectedTopic?.category}`}
            </p>
          </div>
          {selectedTopic && (
            <button
              onClick={() => { setSelectedTopic(null); setAudioBlob(null); }}
              className="text-sm text-gray-400 hover:text-white border border-gray-700 px-4 py-2 rounded-xl transition-all"
            >
              ← Change Topic
            </button>
          )}
        </div>

        {/* ── Topic Selection ── */}
        {!selectedTopic && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Choose a Speaking Topic</p>
            {TOPICS.map((topic, i) => (
              <button
                key={i}
                onClick={() => selectTopic(topic)}
                className={`w-full text-left p-6 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-0.5 ${topic.color} hover:shadow-lg`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-white font-semibold text-lg leading-relaxed flex-1">
                    "{topic.label}"
                  </p>
                  <span className="text-2xl mt-1">→</span>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${topic.badge}`}>
                    {topic.category}
                  </span>
                  <span className={`text-xs font-semibold ${DIFFICULTY_COLOR[topic.difficulty]}`}>
                    {topic.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Recording + Submission (shown after topic picked) ── */}
        {selectedTopic && (
          <>
            {/* Topic display */}
            <div className={`rounded-3xl p-8 border-2 ${selectedTopic.color}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${selectedTopic.badge}`}>
                  {selectedTopic.category}
                </span>
                <span className={`text-xs font-semibold ${DIFFICULTY_COLOR[selectedTopic.difficulty]}`}>
                  {selectedTopic.difficulty}
                </span>
              </div>
              <h3 className="text-xl text-white font-semibold leading-relaxed">
                📝 "{selectedTopic.label}"
              </h3>
              <p className="text-gray-400 text-sm mt-3">
                Record your response with the microphone, or upload a pre-recorded audio file.
              </p>
            </div>

            {/* Audio capture */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 space-y-8">
              <AudioInput
                onAudioReady={handleAudioReady}
                onReset={() => { setAudioBlob(null); setAudioDuration(0); }}
                disabled={uploading}
              />

              {/* Submit / spinner */}
              {audioBlob && !uploading && (
                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={submitAudio}
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  >
                    ✅ Finish & Analyse
                  </button>
                </div>
              )}

              {uploading && (
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-blue-400 font-semibold">AI is analysing your response…</span>
                </div>
              )}
            </div>

            {/* Tips panel */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h4 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-4">💡 Quick Tips</h4>
              <ul className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">✦</span><span>Speak in complete sentences — avoid trailing off.</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">✦</span><span>Use pauses intentionally instead of filler words.</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">✦</span><span>Structure your answer: Context → Action → Result.</span></li>
              </ul>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default GuidedPractice;