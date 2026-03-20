import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Link, useLocation } from "react-router-dom";

const SpeechResult = () => {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-white p-10 text-center">
          <h2 className="text-2xl font-bold mb-4">No analysis data found.</h2>
          <Link to="/practice" className="text-blue-500 hover:text-white transition-colors underline">Go Back to Practice</Link>
        </div>
      </DashboardLayout>
    );
  }

  const aiObj = data.ai_evaluation || {};

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">Speech Analysis Result</h2>
          <p className="text-gray-400 mt-2">Detailed breakdown of your recent performance.</p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 text-center hover:border-blue-500/50 transition-all">
            <p className="text-blue-500 text-3xl mb-2">🏆</p>
            <p className="text-4xl font-bold text-white mb-2">{aiObj.confidence_score || 0}<span className="text-xl text-blue-500">%</span></p>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Confidence</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 text-center hover:border-green-500/50 transition-all">
            <p className="text-green-500 text-3xl mb-2">⚡</p>
            <p className="text-4xl font-bold text-white mb-2">{aiObj.speech_clarity || 0}<span className="text-xl text-green-500">%</span></p>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Fluency</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 text-center hover:border-purple-500/50 transition-all">
            <p className="text-purple-500 text-3xl mb-2">💎</p>
            <p className="text-4xl font-bold text-white mb-2">{aiObj.pace || 0}<span className="text-xl text-purple-500">%</span></p>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Pace</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 text-center hover:border-yellow-500/50 transition-all">
            <p className="text-yellow-400 text-3xl mb-2">📝</p>
            <p className="text-4xl font-bold text-white mb-2">{aiObj.grammar_score || 0}<span className="text-xl text-yellow-400">%</span></p>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Grammar</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 text-center hover:border-red-500/50 transition-all">
            <p className="text-red-500 text-3xl mb-2">🛑</p>
            <p className="text-4xl font-bold text-white mb-2">{aiObj.filler_words || 0}</p>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Filler Words</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Transcript Section */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            <h3 className="text-sm uppercase tracking-widest font-bold text-blue-500 mb-6 flex items-center gap-2">
              <span>✍️</span> Transcript
            </h3>
            <div className="bg-black/40 border border-gray-800 rounded-2xl p-6 h-64 overflow-y-auto">
              <p className="text-gray-300 leading-relaxed text-lg">
                {data.transcription_detected}
              </p>
            </div>
          </div>

          {/* AI Feedback Section */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            <h3 className="text-sm uppercase tracking-widest font-bold text-green-500 mb-6 flex items-center gap-2">
              <span>🧠</span> AI Feedback
            </h3>
            <p className="text-xl text-white font-medium mb-6 leading-relaxed">
              {aiObj.ai_feedback || "The AI didn't provide any specific comments."}
            </p>

            <div className="bg-black/40 border border-gray-800 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">Notes</h4>
              <ul className="space-y-4 text-gray-300">
                <li className="flex gap-3">
                   <span className="text-purple-500">✦</span>
                   <span>Remember to try reducing any occurrences of filler words.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Link to="/practice" className="inline-block px-10 py-5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 text-white rounded-xl font-bold transition-all hover:-translate-y-1">
            🎙️ Practice Again
          </Link>
          <Link to="/dashboard" className="inline-block px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
            Back to Dashboard
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SpeechResult;