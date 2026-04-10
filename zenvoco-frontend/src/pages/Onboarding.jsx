import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [purpose, setPurpose] = useState("");
  const [level, setLevel] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) setUserName(name);
  }, []);

  const handleContinue = () => {
    localStorage.setItem("purpose", purpose);
    localStorage.setItem("level", level);
    navigate("/dashboard");
  };

  const purposes = [
    "Interview Preparation",
    "Presentation Skills",
    "Viva Preparation",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="relative min-h-screen bg-transparent text-slate-800 dark:text-white selection:bg-blue-500/30 flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Logo */}
        {/*<h1 className="text-3xl font-bold text-blue-500 mb-2">Zenvoco</h1>*/}

        {/* Welcome */}
        <h2 className="text-4xl md:text-5xl font-black mt-6 tracking-tight text-[#0f172a] dark:text-white">
          Welcome{userName ? `, ${userName}` : ""}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-lg mt-2 mb-10 text-center">
          Let's personalize your communication journey
        </p>

        {/* Card */}
        <div className="w-full max-w-4xl bg-white/70 dark:bg-gray-900/40 backdrop-blur-lg border border-[#0ea5e9]/10 dark:border-gray-800 rounded-3xl p-10 md:p-12 space-y-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Purpose */}
          <div>
            <h3 className="text-2xl font-black mb-6 text-[#0f172a] dark:text-white tracking-tight">
              What is your main purpose?
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {purposes.map((item) => (
                <div
                  key={item}
                  onClick={() => setPurpose(item)}
                  className={`p-6 rounded-xl cursor-pointer border text-center font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-[0_8px_30px_rgb(14,165,233,0.15)]
                  ${purpose === item
                      ? "bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9] shadow-[0_0_15px_rgba(14,165,233,0.2)]"
                      : "bg-white/50 dark:bg-black/40 border-[#0ea5e9]/10 dark:border-gray-800 hover:border-[#0ea5e9]/50 text-slate-600 dark:text-gray-300 hover:text-slate-900 hover:bg-white"
                    }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Level */}
          <div>
            <h3 className="text-2xl font-black mb-6 text-[#0f172a] dark:text-white tracking-tight">
              What is your current comfort level?
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {levels.map((item) => (
                <div
                  key={item}
                  onClick={() => setLevel(item)}
                  className={`p-6 rounded-xl cursor-pointer border text-center font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-[0_8px_30px_rgb(45,212,191,0.15)]
                  ${level === item
                      ? "bg-[#2dd4bf]/10 border-[#2dd4bf] text-[#0d9488] dark:text-[#2dd4bf] shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                      : "bg-white/50 dark:bg-black/40 border-[#0ea5e9]/10 dark:border-gray-800 hover:border-[#2dd4bf]/50 text-slate-600 dark:text-gray-300 hover:text-slate-900 hover:bg-white"
                    }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Button */}
          <button
            disabled={!purpose || !level}
            onClick={handleContinue}
            className={`w-full py-5 rounded-full font-bold text-lg transition-all duration-300
            ${!purpose || !level
                ? "bg-gray-100 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-800"
                : "bg-[#0284c7] text-white hover:bg-[#0369a1] shadow-[0_4px_14px_0_rgb(2,132,199,0.39)] transform hover:-translate-y-0.5"
              }`}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;