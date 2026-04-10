import React, { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";

// ─── Full content library ───────────────────────────────────────────────────
const TOPICS = [
  {
    id: "self-intro",
    label: "Self Introduction",
    icon: "🙋",
    color: "blue",
    tagline: "Your first 60 seconds shape the entire conversation.",
    explanation:
      "A strong self-introduction is concise, confident, and tailored to the audience. It tells them who you are, what you do, and why you matter — without sounding scripted.",
    structure: [
      { step: "Greeting", detail: "Open with a warm, clear greeting and your full name." },
      { step: "Background", detail: "2–3 sentences on your academic or professional background." },
      { step: "Strengths", detail: "Highlight 1–2 key skills with a quick example." },
      { step: "Goal", detail: "Close with your ambition or what you're looking for." },
    ],
    hints: [
      "Time yourself — aim for 60–90 seconds, not longer.",
      "Maintain eye contact or look into the camera on video calls.",
      "Smile naturally; warmth is as important as content.",
      "Avoid starting with 'So…' or 'Um…' — they undercut confidence.",
    ],
    sample:
      "\"Good morning. I'm Anil Varma, a final-year Computer Science student at VIT with a focus on AI and full-stack development. I've built production-level web apps during internships, most recently a real-time analytics dashboard that reduced report time by 40%. I'm passionate about bridging AI research with user-facing products, and I'm excited about the opportunity to contribute here.\"",
    dos: ["Use specific numbers and outcomes", "Practice until it feels natural", "Match tone to the room (formal vs casual)"],
    donts: ["Don't read from a script", "Don't over-explain your entire history", "Avoid filler words like 'basically' or 'like'"],
  },
  {
    id: "interview",
    label: "Interview Questions",
    icon: "💼",
    color: "purple",
    tagline: "Structure beats memory every time.",
    explanation:
      "Behavioural and situational interview questions test how you think and act, not just what you know. Using the STAR framework (Situation, Task, Action, Result) makes every answer compelling and structured.",
    structure: [
      { step: "Situation", detail: "Set the context — where, when, and the key challenge." },
      { step: "Task", detail: "Explain your specific responsibility in that situation." },
      { step: "Action", detail: "Describe what YOU did (use 'I', not 'we')." },
      { step: "Result", detail: "Share the measurable outcome and what you learned." },
    ],
    hints: [
      "Prepare 5–6 strong STAR stories that can adapt to many questions.",
      "Always quantify results when possible (%, time, money, users).",
      "If asked about weaknesses, show growth, not flaws.",
      "Pause briefly before answering — it shows deliberate thinking.",
    ],
    sample:
      "\"Tell me about a time you handled a tight deadline.\" → \"During my final semester, our team was tasked with delivering a working prototype in 48 hours for a hackathon. My task was to build the data pipeline. I prioritised the critical path, skipped non-essential features, and communicated blockers instantly. We finished with 2 hours to spare and won second place among 80 teams.\"",
    dos: ["Use real, specific stories", "Show self-awareness and growth", "End with what you learned"],
    donts: ["Don't be vague — 'we did stuff' is not an answer", "Don't speak for more than 90 seconds per answer", "Don't bad-mouth previous employers"],
  },
  {
    id: "presentation",
    label: "Presentation Openings",
    icon: "🎤",
    color: "green",
    tagline: "You have 30 seconds to earn their attention.",
    explanation:
      "The opening of any presentation determines whether your audience leans in or tunes out. Great openers hook attention with a question, a bold claim, a surprising fact, or a short story — before the slide content even begins.",
    structure: [
      { step: "Hook", detail: "Open with a question, statistic, or short anecdote." },
      { step: "Relevance", detail: "Tell them why this topic matters to them specifically." },
      { step: "Roadmap", detail: "Give a 1-sentence overview of what you'll cover." },
      { step: "Credibility", detail: "Briefly establish why you're qualified to speak on this." },
    ],
    hints: [
      "Never start with 'Today I will be presenting about…' — it's boring.",
      "Memorize your first 30 seconds word-for-word for maximum confidence.",
      "Vary your pace — slow down for emphasis, speed up for energy.",
      "Use pauses deliberately; silence commands attention.",
    ],
    sample:
      "\"Did you know that 75% of people fear public speaking more than death? Yet the people who speak well consistently earn more, lead more, and influence more. Today I'm going to show you the three techniques that separate forgettable talks from ones people remember for years. Let's begin.\"",
    dos: ["Open with energy and conviction", "Make eye contact with the audience immediately", "Use a pause right after your hook"],
    donts: ["Don't apologise at the start ('Sorry if this is boring…')", "Don't look at your slides when speaking", "Don't rush through the opening"],
  },
  {
    id: "viva",
    label: "Viva & Oral Exams",
    icon: "🎓",
    color: "pink",
    tagline: "Demonstrate understanding, not just memorisation.",
    explanation:
      "A viva (oral examination) tests your depth of understanding and ability to think on your feet. Examiners aren't looking for perfection — they want to see how you reason, how you handle uncertainty, and how deeply you understand your own work.",
    structure: [
      { step: "Clarify", detail: "If unsure, repeat the question back to confirm understanding." },
      { step: "Think Aloud", detail: "Narrate your reasoning even as you work through it." },
      { step: "Anchor to Evidence", detail: "Reference your work, experiments, or literature." },
      { step: "Acknowledge Limits", detail: "Confidently admit what's out of scope or uncertain." },
    ],
    hints: [
      "Review your own submission in detail — examiners often quote it directly.",
      "Saying 'I don't know, but here's how I'd find out' > bluffing.",
      "Speak to all examiners, not just the one who asked the question.",
      "Defend your choices; examiners respect conviction backed by reasoning.",
    ],
    sample:
      "Examiner: 'Why did you choose MongoDB over a relational database?' → \"Good question. My primary consideration was schema flexibility — the user-generated content in my app varied widely in structure, which would have required many nullable columns in SQL. MongoDB let me iterate faster during development, and since my data access patterns were document-centric rather than relational, it was a natural fit for the use case.\"",
    dos: ["Back every claim with a reason", "Stay calm if challenged — it's part of the process", "Speak clearly and at a measured pace"],
    donts: ["Don't say 'because it's better' without justification", "Don't try to bluff technical knowledge", "Don't rush answers — think first"],
  },
];

const COLOR_MAP = {
  blue:   { active: "bg-[#2563eb] border-[#1d4ed8]", badge: "bg-[#0ea5e9]/20 text-[#0ea5e9] border-[#0ea5e9]/30", dot: "bg-[#0ea5e9]", heading: "text-[#0ea5e9]", glow: "bg-[#0ea5e9]/10" },
  purple: { active: "bg-[#2563eb] border-[#1d4ed8]", badge: "bg-[#0ea5e9]/20 text-[#0ea5e9] border-[#0ea5e9]/30", dot: "bg-[#0ea5e9]", heading: "text-[#0ea5e9]", glow: "bg-[#0ea5e9]/10" },
  green:  { active: "bg-[#2563eb] border-[#1d4ed8]", badge: "bg-[#0ea5e9]/20 text-[#0ea5e9] border-[#0ea5e9]/30", dot: "bg-[#0ea5e9]", heading: "text-[#0ea5e9]", glow: "bg-[#0ea5e9]/10" },
  pink:   { active: "bg-[#2563eb] border-[#1d4ed8]", badge: "bg-[#0ea5e9]/20 text-[#0ea5e9] border-[#0ea5e9]/30", dot: "bg-[#0ea5e9]", heading: "text-[#0ea5e9]", glow: "bg-[#0ea5e9]/10" },
};

const LearnMode = () => {
  const [selectedId, setSelectedId] = useState("self-intro");
  const [activeTab, setActiveTab]   = useState("guide"); // "guide" | "dos" | "sample"

  const topic = TOPICS.find((t) => t.id === selectedId);
  const c     = COLOR_MAP[topic.color];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">Learn Mode</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Study guided frameworks for every high-stakes speaking scenario.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 items-start">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1 space-y-3">
            {TOPICS.map((t) => {
              const tc = COLOR_MAP[t.color];
              return (
                <button
                  key={t.id}
                  onClick={() => { setSelectedId(t.id); setActiveTab("guide"); }}
                  className={`block w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 border ${
                    selectedId === t.id
                      ? `bg-[#2563eb] border-[#1d4ed8] text-white font-bold shadow-[0_8px_30px_rgb(37,99,235,0.3)]`
                      : "bg-white/90 dark:bg-gray-900/60 backdrop-blur-md border-gray-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-blue-400/30 hover:shadow-md"
                  }`}
                >
                  <span className="mr-3 text-2xl align-middle">{t.icon}</span><span className="font-semibold text-lg align-middle">{t.label}</span>
                </button>
              );
            })}

            {/* Quick tip card */}
            <div className="mt-6 bg-white/70 backdrop-blur-lg dark:bg-gray-900/60 border border-[#0ea5e9]/10 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <p className="text-sm tracking-widest text-[#475569] font-black mb-2">💡 STUDY TIP</p>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                Read the framework, then try recording yourself using the Guided Practice mode to apply it.
              </p>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Topic Hero */}
            <div className={`relative rounded-3xl p-8 border border-[#0ea5e9]/10 bg-white/70 shadow-sm dark:bg-gray-900/50 backdrop-blur-xl overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-64 h-64 ${c.glow} rounded-full blur-[80px] -z-10`} />
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl">{topic.icon}</span>
                <div>
                  <h3 className={`text-3xl font-black ${c.heading} tracking-tight`}>{topic.label}</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 font-medium">{topic.tagline}</p>
                </div>
              </div>
              <p className="text-slate-700 dark:text-gray-300 text-lg leading-relaxed font-medium">{topic.explanation}</p>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-3 flex-wrap">
              {[
                { key: "guide",  label: "📐 Framework" },
                { key: "dos",    label: "✅ Do's & Don'ts" },
                { key: "sample", label: "💬 Sample Answer" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-3 rounded-full font-bold text-sm transition-all border shadow-sm ${
                    activeTab === key
                      ? "bg-[#0ea5e9] text-white border-[#0ea5e9]"
                      : "bg-white/70 dark:bg-gray-900 border-[#0ea5e9]/10 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-white hover:border-[#0ea5e9]/30"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Tab: Framework ── */}
            {activeTab === "guide" && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Structure */}
                <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 space-y-4">
                  <h4 className="text-sm uppercase tracking-widest font-bold text-[#0ea5e9] flex items-center gap-2">
                    <span>📐</span> Step-by-Step Structure
                  </h4>
                  <ol className="space-y-4">
                    {topic.structure.map(({ step, detail }, i) => (
                      <li key={i} className="flex gap-4">
                        <span className={`flex-shrink-0 w-7 h-7 rounded-full ${c.dot} text-white font-bold flex items-center justify-center`}>
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-gray-900 dark:text-white font-semibold">{step}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">{detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* AI Hints */}
                <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 space-y-4">
                  <h4 className="text-sm uppercase tracking-widest font-bold text-[#38bdf8] flex items-center gap-2">
                    <span>🤖</span> AI Coaching Hints
                  </h4>
                  <ul className="space-y-4">
                    {topic.hints.map((hint, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-gray-300 font-medium">
                        <span className="text-[#38bdf8] mt-0.5 text-lg">✦</span>
                        <span className="leading-relaxed">{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ── Tab: Do's & Don'ts ── */}
            {activeTab === "dos" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8">
                  <h4 className="text-sm uppercase tracking-widest font-bold text-[#0ea5e9] flex items-center gap-2 mb-6">
                    <span>✅</span> Do's
                  </h4>
                  <ul className="space-y-4">
                    {topic.dos.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-gray-300 font-medium">
                        <span className="text-[#0ea5e9] text-xl mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8">
                  <h4 className="text-sm uppercase tracking-widest font-bold text-red-500 flex items-center gap-2 mb-6">
                    <span>🚫</span> Don'ts
                  </h4>
                  <ul className="space-y-4">
                    {topic.donts.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-gray-300 font-medium">
                        <span className="text-red-500 text-xl mt-0.5">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ── Tab: Sample Answer ── */}
            {activeTab === "sample" && (
              <div className="bg-gradient-to-br from-[#0e4063] via-[#09324f] to-[#041a2e] border border-[#0ea5e9]/30 rounded-3xl p-10">
                <h4 className="text-sm uppercase tracking-widest font-bold text-[#38bdf8] flex items-center gap-2 mb-6">
                  <span>💬</span> Example Response
                </h4>
                <p className="text-xl text-[#bae6fd]/90 leading-relaxed italic">{topic.sample}</p>
                <div className="mt-8 pt-6 border-t border-blue-500/20">
                  <p className="text-sm text-gray-500 font-medium">
                    📌 This is a template to inspire you — personalise it with your own real experiences before practice.
                  </p>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-white/70 dark:bg-gray-900/50 border border-[#0ea5e9]/10 rounded-2xl p-6 flex items-center justify-between gap-6 flex-wrap shadow-sm">
              <div>
                <p className="font-black text-[#0f172a] dark:text-white tracking-tight">Ready to apply what you've learned?</p>
                <p className="text-sm text-slate-600 dark:text-gray-400 mt-1 font-medium">Open Guided Practice and use this framework in a recorded session.</p>
              </div>
              <a
                href="/practice"
                className="px-8 py-4 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-full font-bold transition-all shrink-0 shadow-[0_4px_14px_0_rgb(2,132,199,0.39)] transform hover:-translate-y-0.5"
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

export default LearnMode;