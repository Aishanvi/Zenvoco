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
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black relative overflow-hidden">

            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header Section */}
            <div className="text-center mb-16 space-y-4 animate-fade-in-down relative z-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Welcome back, <span className="text-blue-500">{name}! 👋</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl">
                    What would you like to focus on today?
                </p>
            </div>

            {/* Grid of Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full relative z-10">

                {/* Card 1: Listen Mode */}
                <Link to="/listen" className="group relative bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-300 -mr-10 -mt-10"></div>
                    <div className="text-5xl mb-6 bg-gray-100 dark:bg-gray-800/50 w-20 h-20 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        🎧
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Listen & Observe</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
                        Listen to examples and absorb structure. Low effort, great for warm-ups.
                    </p>
                    <div className="mt-6 text-blue-500 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Start Listening <span className="text-lg">→</span>
                    </div>
                </Link>

                {/* Card 2: Learn Mode */}
                <Link to="/learn" className="group relative bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-300 -mr-10 -mt-10"></div>
                    <div className="text-5xl mb-6 bg-gray-100 dark:bg-gray-800/50 w-20 h-20 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300">
                        📖
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Learn Theory</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
                        Refresh your knowledge on interview tips and presentation structures.
                    </p>
                    <div className="mt-6 text-purple-500 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Open Library <span className="text-lg">→</span>
                    </div>
                </Link>

                {/* Card 3: Guided Practice */}
                <Link to="/practice" className="group relative bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-300 -mr-10 -mt-10"></div>
                    <div className="text-5xl mb-6 bg-gray-100 dark:bg-gray-800/50 w-20 h-20 rounded-2xl flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform duration-300">
                        🎤
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Guided Practice</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
                        Practice speaking with real-time AI guidance and prompts.
                    </p>
                    <div className="mt-6 text-green-500 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Start Speaking <span className="text-lg">→</span>
                    </div>
                </Link>

                {/* Card 4: Viva Simulation (The Highlight) */}
                <Link to="/viva" className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 hover:border-pink-500/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all duration-300 -mr-10 -mt-10"></div>
                    <div className="text-5xl mb-6 bg-gray-100 dark:bg-gray-800/50 w-20 h-20 rounded-2xl flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform duration-300">
                        🔥
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Viva Simulation</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow">
                        Test your skills in a realistic AI mockup. Are you ready for the heat?
                    </p>
                    <div className="mt-6 text-pink-500 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Take the Challenge <span className="text-lg">→</span>
                    </div>
                </Link>

            </div>

            {/* Alternative actions */}
            <div className="mt-16 text-center relative z-10">
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-white transition-colors border-b border-transparent hover:border-white pb-1 font-medium">
                    Or go straight to your Dashboard
                </Link>
            </div>

        </div>
    );
};

export default DailyCheckIn;
