import { useState, useRef } from "react";
import DashboardLayout from "../layout/DashboardLayout";

// ─── Example library with transcript and insights ────────────────────────────
const EXAMPLES = [
  {
    id: "self-intro",
    label: "Self Introduction",
    audio: "/audio/self-intro.mp3",
    icon: "🙋",
    badge: "Beginner",
    badgeColor: "bg-green-500/20 text-green-400 border border-green-500/30",
    duration: "1:20",
    description: "A confident, structured self-introduction for an interview or networking setting.",
    transcript:
      "Good morning... thank you for giving me this opportunity.\nMy name is Riya, and I am currently pursuing my Bachelor’s degree in Computer Science Engineering.\nI have a strong interest in learning new technologies and improving my skills. I enjoy working on projects that help me apply my knowledge to real-world problems.\nOver time, I have developed skills such as problem-solving, communication, and teamwork, which help me work effectively in different situations.\nI consider myself a quick learner, adaptable, and always willing to take on new challenges.\nI am really excited about this opportunity as it allows me to grow both personally and professionally.\nThank you.",
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
    audio: "/audio/interview.mp3",
    icon: "💼",
    badge: "Intermediate",
    badgeColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    duration: "1:45",
    description: "A behavioural interview answer using the STAR framework for a leadership question.",
    transcript: `Interviewer: Good morning. Please have a seat.\nStudent: Good morning, sir. Thank you.\nInterviewer: Let’s start with a quick introduction. Tell me about yourself.\nStudent: Certainly. My name is Aishanvi, and I am currently pursuing my Bachelor’s degree in Computer Science Engineering. I have a strong interest in artificial intelligence and full-stack development. Over time, I have worked on projects that focus on solving real-world problems, which helped me strengthen both my technical and problem-solving skills.\nInterviewer: That sounds good. Can you explain one project that you are particularly proud of?\nStudent: Yes, one project I am proud of is a web-based application designed to improve communication confidence using artificial intelligence. The system analyzes speech and provides feedback on parameters like fluency, clarity, and speaking pace. Through this project, I gained hands-on experience in integrating frontend and backend technologies, as well as working with real-time data processing.\nInterviewer: Interesting. What challenges did you face while building this project?\nStudent: One of the main challenges was ensuring accurate speech analysis. Initially, the results were inconsistent, so I had to explore different approaches and refine the implementation. This helped me understand the importance of testing and continuous improvement.\nInterviewer: Good. What are your strengths?\nStudent: I would say my biggest strength is my ability to learn quickly and adapt to new technologies. I am also a good team player and believe in clear communication and collaboration.\nInterviewer: And what is one weakness you are working on?\nStudent: I used to focus too much on perfection, which sometimes affected my speed. However, I am actively improving my time management and prioritization skills.\nInterviewer: Why should we hire you?\nStudent: I believe I am a good fit for this role because I have a strong technical foundation and a genuine interest in learning and growing. I am dedicated, adaptable, and always ready to take initiative.\nInterviewer: Do you have any questions for us?\nStudent: Yes, I would like to know more about the opportunities for learning and growth within your organization.\nInterviewer: That’s a good question. We’ll discuss that. Thank you.\nStudent: Thank you, sir.`,
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
    audio: "/audio/presentation.mp3",
    icon: "🎤",
    badge: "Advanced",
    badgeColor: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    duration: "0:45",
    description: "A hook-driven opening for a technical presentation that grabs attention instantly.",
    transcript: `Good morning everyone...\nFirst of all, thank you for giving me this opportunity.\nToday, I am going to talk about the impact of technology in our daily life.\nTo begin with, technology has become an essential part of our lives and helps us in communication, learning, and daily tasks.\nMoving on, it also saves time and improves efficiency in many areas.\nFinally, to conclude, technology has made our lives easier, and its impact will continue to grow in the future.\nThank you.`,
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
  const [selectedId, setSelectedId] = useState("self-intro");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const audioRef = useRef(null);

  const example = EXAMPLES.find((e) => e.id === selectedId);

  const selectExample = (id) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSelectedId(id);
    setProgress(0);
    setShowTranscript(false);
    setIsPlaying(false);
  };

  // ▶️ Play / Pause
  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 🔁 Reset
  const resetPlayback = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
      setShowTranscript(false);
    }
  };

  // ⏱ Progress update
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;

    if (duration) {
      setProgress((current / duration) * 100);
    }
  };

  // ⏱ Time display (same UI logic preserved)
  const [durMin, durSec] = example.duration.split(":").map(Number);
  const totalSec = durMin * 60 + durSec;
  const elapsed = Math.round((progress / 100) * totalSec);
  const elMin = Math.floor(elapsed / 60).toString().padStart(1, "0");
  const elSec = (elapsed % 60).toString().padStart(2, "0");

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Listen & Observe</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Listen to expert examples, read the transcript, and study the technique breakdown.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => selectExample(ex.id)}
                className={`block w-full text-left px-5 py-5 rounded-3xl transition-all duration-300 border ${selectedId === ex.id
                  ? "bg-[#2563eb] border-[#1d4ed8] text-white font-bold shadow-[0_8px_30px_rgb(37,99,235,0.3)]"
                  : "bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border-[#0ea5e9]/10 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-[#0ea5e9]/30 hover:shadow-md"
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{ex.icon}</span>
                  <span className="font-semibold text-lg">{ex.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${ex.badgeColor} ${selectedId === ex.id ? 'bg-black/10 border-transparent text-white' : ''}`}>
                    {ex.badge}
                  </span>
                  <span className={`text-xs font-semibold flex items-center gap-1 ${selectedId === ex.id ? 'text-blue-100' : 'text-slate-500'}`}>
                    ⏱ {ex.duration}
                  </span>
                </div>
              </button>
            ))}

            {/* Legend */}
            <div className="mt-4 bg-white/70 backdrop-blur-lg dark:bg-gray-900/60 border border-[#0ea5e9]/10 dark:border-gray-800 rounded-3xl p-6 space-y-3 shadow-sm">
              <p className="text-sm tracking-widest text-[#475569] font-black mb-3">AFTER LISTENING</p>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                ✦ Study the insight breakdown to understand <em className="text-slate-800 dark:text-gray-300">why</em> each technique works.
              </p>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                ✦ Then go to <strong className="text-[#0ea5e9] dark:text-[#0ea5e9]">Guided Practice</strong> and try it yourself.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* 🎧 AUDIO ELEMENT */}
            <audio
              ref={audioRef}
              src={example.audio}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                setIsPlaying(false);
                setShowTranscript(true);
              }}
            />

            {/* Example Info Card */}
            <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#0ea5e9]/10 rounded-full blur-[60px] -z-10" />
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{example.icon}</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-[#0f172a] dark:text-white tracking-tight">{example.label}</h3>
                  <p className="text-slate-600 dark:text-gray-400 text-sm mt-1 font-medium">{example.description}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${example.badgeColor}`}>
                  {example.badge}
                </span>
              </div>

              {/* Key Techniques Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {example.keyTechniques.map((t, i) => (
                  <span key={i} className="bg-white/50 dark:bg-gray-800 border border-[#0ea5e9]/5 dark:border-gray-700 text-slate-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full font-bold shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 shadow-sm">
              <h4 className="text-sm uppercase tracking-widest font-black text-[#0f172a] mb-6 flex items-center gap-2">
                <span>🎧</span> Audio Simulation
              </h4>

              <div className="flex items-center gap-6">
                <button
                  onClick={togglePlayback}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-lg shrink-0 text-white ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-[#0284c7] hover:bg-[#0369a1]"
                    }`}
                >
                  {isPlaying ? "⏸" : progress >= 100 ? "↺" : "▶"}
                </button>

                <div className="flex-1 space-y-3">
                  <div
                    className="h-2 w-full bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      if (!audioRef.current || !audioRef.current.duration) return;

                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = (e.clientX - rect.left) / rect.width;

                      audioRef.current.currentTime =
                        pct * audioRef.current.duration;
                    }}
                  >
                    <div
                      className="h-full bg-[#0284c7] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 font-bold">
                    <span>{elMin}:{elSec}</span>
                    <span>{example.duration}</span>
                  </div>
                </div>

                <button onClick={resetPlayback} className="text-slate-500 hover:text-slate-800 dark:text-white transition-colors text-sm font-bold shrink-0">
                  ↺ Restart
                </button>
              </div>
            </div>

            {/* Transcript */}
            <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm uppercase tracking-widest font-black text-[#2dd4bf] flex items-center gap-2">
                  <span>📝</span> Transcript
                </h4>
                <button
                  onClick={() => setShowTranscript((v) => !v)}
                  className="text-xs text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:text-white border border-[#0ea5e9]/20 dark:border-gray-700 bg-white/50 px-3 py-1.5 rounded-lg transition-all font-bold"
                >
                  {showTranscript ? "Hide" : "Show"}
                </button>
              </div>

              {showTranscript ? (
                <div className="bg-white/50 dark:bg-black/40 border border-[#0ea5e9]/5 dark:border-gray-800 rounded-2xl p-6 text-slate-700 dark:text-gray-300 leading-relaxed text-lg font-medium shadow-inner">
                  "{example.transcript}"
                </div>
              ) : (
                <div className="bg-white/50 dark:bg-black/40 border border-[#0ea5e9]/5 dark:border-gray-800 rounded-2xl p-6 text-slate-600 text-center select-none shadow-inner">
                  <p className="font-medium">Listen to the example first, or click <strong className="text-slate-800 dark:text-gray-400">Show</strong> to reveal the transcript.</p>
                </div>
              )}
            </div>

            {/* Speaking Insights */}
            <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 shadow-sm">
              <h4 className="text-sm uppercase tracking-widest font-black text-[#8b5cf6] flex items-center gap-2 mb-6">
                <span>✨</span> Technique Breakdown
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {example.insights.map(({ label, text }, i) => (
                  <div key={i} className="bg-white/50 dark:bg-black/40 border border-[#0ea5e9]/5 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                    <p className={`font-black text-sm mb-2 text-[#0ea5e9]`}>{label}</p>
                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#0ea5e9]/5 to-transparent border border-[#0ea5e9]/10 dark:border-gray-800 rounded-2xl p-6 flex items-center justify-between gap-6 flex-wrap shadow-sm">
              <div>
                <p className="font-black text-slate-800 dark:text-white tracking-tight text-lg">Now try it yourself</p>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium">Apply this technique in a Guided Practice session and get AI feedback.</p>
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

export default ListenMode;