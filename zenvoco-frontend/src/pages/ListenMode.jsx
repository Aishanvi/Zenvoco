import React, { useState, useRef } from "react";
import DashboardLayout from "../layout/DashboardLayout";

// ─── Example library with transcript and insights ────────────────────────────
const EXAMPLES = [
  {
    id: "self-intro",
    label: "Self Introduction",
    icon: "🙋",
    badge: "Beginner",
    badgeColor: "bg-green-500/20 text-green-400 border border-green-500/30",
    duration: "1:20",
    description: "A confident, structured self-introduction for an interview or networking setting.",
    transcript:
      "Good morning. My name is Anil Varma, a final-year Computer Science student at VIT Vellore, specialising in AI and full-stack development. Over the past two years, I've interned at two early-stage startups where I built real-time web applications used by thousands of daily users. My strongest skill is translating complex backend logic into clean, intuitive user interfaces. I'm passionate about solving real problems at the intersection of AI and product design. I look forward to bringing that perspective to this role.",
    insights: [
      { label: "Strong Opening", text: "Opens with name and institution — no 'ums' or hesitation.", color: "text-green-400" },
      { label: "Quantified Impact", text: "Uses 'thousands of daily users' — specific and credible.", color: "text-blue-400" },
      { label: "Skill Framing", text: "Skill is described from the listener's perspective (benefit), not just capability.", color: "text-purple-400" },
      { label: "Confident Close", text: "Ends with forward-looking intent — shows enthusiasm without overselling.", color: "text-yellow-400" },
    ],
    keyTechniques: ["Name + context in under 5 seconds", "Quantified social proof", "Unique value proposition", "Future-oriented close"],
  },
  {
    id: "interview",
    label: "Interview Answer (STAR)",
    icon: "💼",
    badge: "Intermediate",
    badgeColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    duration: "1:45",
    description: "A behavioural interview answer using the STAR framework for a leadership question.",
    transcript:
      "In my third year, our 6-person project group hit a wall — two members dropped out 3 weeks before submission, and the remaining team was panicking. I stepped up to reorganise the project scope. I mapped out what was absolutely essential versus nice-to-have, reassigned tasks based on each person's strengths, and created a shared tracker so everyone could see progress in real time. I also set up daily 15-minute check-ins to catch blockers early. In the end, we delivered a fully functioning prototype and scored 87 out of 100. The examiner actually commented on our presentation clarity. More importantly, the team said they felt supported throughout.",
    insights: [
      { label: "Clear Situation", text: "Stakes are established immediately — dropped members, deadline pressure.", color: "text-green-400" },
      { label: "'I' not 'We'", text: "Clearly owns the actions — 'I stepped up', 'I created', 'I set up'.", color: "text-blue-400" },
      { label: "Specific Result", text: "87/100 is concrete. Examiner quote adds credibility.", color: "text-purple-400" },
      { label: "Human Touch", text: "Closes with team impact — shows empathy alongside outcome.", color: "text-yellow-400" },
    ],
    keyTechniques: ["Situation in 1–2 sentences", "Single clear task/responsibility", "Action verbs in first-person", "Quantified + qualitative outcome"],
  },
  {
    id: "presentation",
    label: "Presentation Opening",
    icon: "🎤",
    badge: "Advanced",
    badgeColor: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    duration: "0:45",
    description: "A hook-driven opening for a technical presentation that grabs attention instantly.",
    transcript:
      "Imagine you spend four years studying, thousands of hours preparing — and then lose the job offer because of a 2-minute conversation you weren't ready for. That conversation is the interview. And yet, most of us practice our skills far more than we practice speaking about them. Today I'm going to show you how three specific techniques can make any speaker — including you — sound twice as confident in half the time. Let's start with the one thing most people get wrong in the first 10 seconds.",
    insights: [
      { label: "Vivid Hook", text: "Opens with a scenario the audience can feel — not a statistic, but an experience.", color: "text-green-400" },
      { label: "Relevance Bridge", text: "Connects immediately to the audience's own situation (their interviews, their speaking).", color: "text-blue-400" },
      { label: "Clear Promise", text: "'Twice as confident in half the time' — a crisp, memorable value proposition.", color: "text-purple-400" },
      { label: "Curiosity Close", text: "Teases the content without revealing it — compels the audience to keep listening.", color: "text-yellow-400" },
    ],
    keyTechniques: ["Open with an image or scenario", "Bridge to audience relevance", "State a clear, time-bound promise", "End opener on a cliffhanger"],
  },
];

const ListenMode = () => {
  const [selectedId, setSelectedId]       = useState("self-intro");
  const [isPlaying, setIsPlaying]         = useState(false);
  const [progress, setProgress]           = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const intervalRef                       = useRef(null);

  const example = EXAMPLES.find((e) => e.id === selectedId);

  const selectExample = (id) => {
    stopPlayback();
    setSelectedId(id);
    setProgress(0);
    setShowTranscript(false);
  };

  // ── Simulated playback (no real audio file needed) ───────────────────────
  const startPlayback = () => {
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          setShowTranscript(true);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);
  };

  const stopPlayback = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (progress >= 100) {
      setProgress(0);
      setShowTranscript(false);
      startPlayback();
    } else if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const resetPlayback = () => {
    stopPlayback();
    setProgress(0);
    setShowTranscript(false);
  };

  // Convert progress % back to MM:SS display
  const [durMin, durSec] = example.duration.split(":").map(Number);
  const totalSec = durMin * 60 + durSec;
  const elapsed  = Math.round((progress / 100) * totalSec);
  const elMin    = Math.floor(elapsed / 60).toString().padStart(1, "0");
  const elSec    = (elapsed % 60).toString().padStart(2, "0");

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">Listen & Observe</h2>
          <p className="text-gray-400 mt-2">
            Listen to expert examples, read the transcript, and study the technique breakdown.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1 space-y-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => selectExample(ex.id)}
                className={`block w-full text-left px-5 py-5 rounded-2xl transition-all duration-300 border ${
                  selectedId === ex.id
                    ? "bg-blue-600 border-blue-500 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{ex.icon}</span>
                  <span className="font-semibold">{ex.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${ex.badgeColor}`}>
                    {ex.badge}
                  </span>
                  <span className="text-xs text-gray-500">⏱ {ex.duration}</span>
                </div>
              </button>
            ))}

            {/* Legend */}
            <div className="mt-4 bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-2">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">After Listening</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                ✦ Read the insight breakdown to understand <em>why</em> each technique works.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                ✦ Then go to <strong className="text-white">Guided Practice</strong> and try it yourself.
              </p>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Example Info Card */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -z-10" />
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{example.icon}</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">{example.label}</h3>
                  <p className="text-gray-400 text-sm mt-1">{example.description}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${example.badgeColor}`}>
                  {example.badge}
                </span>
              </div>

              {/* Key Techniques Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {example.keyTechniques.map((t, i) => (
                  <span key={i} className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-xl font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
              <h4 className="text-sm uppercase tracking-widest font-bold text-blue-400 mb-6 flex items-center gap-2">
                <span>🎧</span> Audio Simulation
              </h4>

              <div className="flex items-center gap-6">
                {/* Play/Pause button */}
                <button
                  onClick={togglePlayback}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-lg shrink-0 ${
                    isPlaying
                      ? "bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                      : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  }`}
                >
                  {isPlaying ? "⏸" : progress >= 100 ? "↺" : "▶"}
                </button>

                <div className="flex-1 space-y-3">
                  {/* Progress bar */}
                  <div
                    className="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      if (!isPlaying) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct  = ((e.clientX - rect.left) / rect.width) * 100;
                        setProgress(Math.min(100, Math.max(0, pct)));
                      }
                    }}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {/* Time display */}
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>{elMin}:{elSec}</span>
                    <span>{example.duration}</span>
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={resetPlayback}
                  className="text-gray-500 hover:text-white transition-colors text-sm font-medium shrink-0"
                  title="Reset"
                >
                  ↺
                </button>
              </div>

              {isPlaying && (
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex gap-1 items-end h-6">
                    {[3, 5, 4, 7, 3, 6, 4, 5, 3, 6].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-blue-400 rounded-full animate-pulse"
                        style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-blue-400 text-sm font-medium">Now playing…</span>
                </div>
              )}

              {progress >= 100 && !isPlaying && (
                <div className="mt-4 text-green-400 text-sm font-semibold flex items-center gap-2">
                  <span>✓</span> Playback complete. Review the transcript and insights below.
                </div>
              )}
            </div>

            {/* Transcript (revealed after play or toggle) */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm uppercase tracking-widest font-bold text-green-400 flex items-center gap-2">
                  <span>📝</span> Transcript
                </h4>
                <button
                  onClick={() => setShowTranscript((v) => !v)}
                  className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1.5 rounded-lg transition-all"
                >
                  {showTranscript ? "Hide" : "Show"}
                </button>
              </div>

              {showTranscript ? (
                <div className="bg-black/40 border border-gray-800 rounded-2xl p-6 text-gray-300 leading-relaxed text-lg">
                  "{example.transcript}"
                </div>
              ) : (
                <div className="bg-black/40 border border-gray-800 rounded-2xl p-6 text-gray-600 text-center select-none">
                  <p>Listen to the example first, or click <strong className="text-gray-400">Show</strong> to reveal the transcript.</p>
                </div>
              )}
            </div>

            {/* Speaking Insights */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
              <h4 className="text-sm uppercase tracking-widest font-bold text-purple-400 flex items-center gap-2 mb-6">
                <span>✨</span> Technique Breakdown
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {example.insights.map(({ label, text, color }, i) => (
                  <div key={i} className="bg-black/40 border border-gray-800 rounded-2xl p-5">
                    <p className={`font-bold text-sm mb-2 ${color}`}>{label}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 flex items-center justify-between gap-6 flex-wrap">
              <div>
                <p className="font-semibold text-white">Now try it yourself</p>
                <p className="text-sm text-gray-400 mt-1">Apply this technique in a Guided Practice session and get AI feedback.</p>
              </div>
              <a
                href="/practice"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                Go to Practice →
              </a>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ListenMode;