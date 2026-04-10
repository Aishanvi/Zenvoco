import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DailyCheckIn = () => {
    const [name, setName] = useState("");
    useEffect(() => {
        const storedName = localStorage.getItem("name");
        if (storedName) {
            setName(storedName);
        }
    }, []);
    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col items-center justify-center p-6 text-slate-800 dark:text-white">

            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header Section */}
            <div className="text-center mb-16 space-y-4 animate-fade-in-down relative z-10">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#0f172a] dark:text-white">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf]">{name}! 👋</span>
                </h1>
                <p className="text-slate-600 dark:text-gray-400 text-lg md:text-xl font-medium tracking-wide">
                    What would you like to focus on today?
                </p>
            </div>

            {/* Grid of Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full relative z-10">

                {/* Card 1: Listen Mode */}
                <Link to="/listen" className="group relative bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 dark:border-gray-800 rounded-3xl p-8 hover:border-[#0ea5e9]/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(14,165,233,0.15)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0ea5e9]/10 rounded-full blur-3xl group-hover:bg-[#0ea5e9]/20 transition-all duration-300 -mr-10 -mt-10"></div>
                    <div className="text-5xl mb-6 bg-white/50 shadow-inner dark:bg-gray-800/50 w-20 h-20 rounded-2xl flex items-center justify-center text-[#0ea5e9] group-hover:scale-110 transition-transform duration-300">
                        🎧
                    </div>
                    <h2 className="text-2xl font-black text-[#0f172a] mb-3">Listen & Observe</h2>
                    <p className="text-slate-600 dark:text-gray-400 text-sm font-medium leading-relaxed flex-grow">
                        Listen to examples and absorb structure. Low effort, great for warm-ups.
                    </p>
                    <div className="mt-6 text-[#0ea5e9] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Start Listening <span className="text-lg">→</span>
                    </div>
                </Link>

                {/* Card 2: Learn Mode */}
                <Link to="/learn" className="group relative bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 dark:border-gray-800 rounded-3xl p-8 hover:border-[#0ea5e9]/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(14,165,233,0.15)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-300 -mr-10 -mt-10"></div>
                    <div className="text-5xl mb-6 bg-white/50 shadow-inner dark:bg-gray-800/50 w-20 h-20 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300">
                        📖
                    </div>
                    <h2 className="text-2xl font-black text-[#0f172a] mb-3">Learn Theory</h2>
                    <p className="text-slate-600 dark:text-gray-400 text-sm font-medium leading-relaxed flex-grow">
                        Refresh your knowledge on interview tips and presentation structures.
                    </p>
                    <div className="mt-6 text-purple-500 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Open Library <span className="text-lg">→</span>
                    </div>
                </Link>

                {/* Card 3: Guided Practice */}
                <Link to="/practice" className="group relative bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 dark:border-gray-800 rounded-3xl p-8 hover:border-[#2dd4bf]/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(45,212,191,0.15)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#2dd4bf]/10 rounded-full blur-3xl group-hover:bg-[#2dd4bf]/20 transition-all duration-300 -mr-10 -mt-10"></div>
                    <div className="text-5xl mb-6 bg-white/50 shadow-inner dark:bg-gray-800/50 w-20 h-20 rounded-2xl flex items-center justify-center text-[#2dd4bf] group-hover:scale-110 transition-transform duration-300">
                        🎤
                    </div>
                    <h2 className="text-2xl font-black text-[#0f172a] mb-3">Guided Practice</h2>
                    <p className="text-slate-600 dark:text-gray-400 text-sm font-medium leading-relaxed flex-grow">
                        Practice speaking with real-time AI guidance and prompts.
                    </p>
                    <div className="mt-6 text-[#2dd4bf] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Start Speaking <span className="text-lg">→</span>
                    </div>
                </Link>

                {/* Card 4: Viva Simulation (The Highlight) */}
                <Link to="/viva" className="group relative bg-white/70 backdrop-blur-xl border border-[#0ea5e9]/10 dark:border-gray-800 rounded-3xl p-8 hover:border-[#0ea5e9]/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(14,165,233,0.15)]">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#0ea5e9]/10 rounded-full blur-3xl group-hover:bg-[#0ea5e9]/20 transition-all duration-300 -mr-10 -mt-10"></div>
                    <div className="text-5xl mb-6 bg-white/50 shadow-inner dark:bg-gray-800/50 w-20 h-20 rounded-2xl flex items-center justify-center text-[#0ea5e9] group-hover:scale-110 transition-transform duration-300">
                        🎓
                    </div>
                    <h2 className="text-2xl font-black mb-3 text-[#0f172a] dark:text-white">Viva Simulation</h2>
                    <p className="text-slate-600 dark:text-gray-400 text-sm font-medium leading-relaxed flex-grow">
                        Test your skills in a realistic AI mockup. Prepare for the panel.
                    </p>
                    <div className="mt-6 text-[#0ea5e9] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Take the Challenge <span className="text-lg">→</span>
                    </div>
                </Link>

            </div>

            {/* Alternative actions */}
            <div className="mt-16 text-center relative z-10">
                <Link to="/dashboard" className="text-slate-500 hover:text-slate-800 dark:text-white transition-colors border-b border-transparent hover:border-slate-800 font-bold">
                    Or go straight to your Dashboard
                </Link>
            </div>

        </div>
    );
};

export default DailyCheckIn;
