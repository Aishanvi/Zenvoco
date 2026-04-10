import React from "react";
import { useLocation, Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

const Results = () => {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return <div className="text-gray-900 dark:text-white p-10">No results available</div>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">

        <h2 className="text-4xl font-bold">Speech Analysis Result</h2>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 p-6 rounded-3xl text-center shadow-sm">
            <p className="text-3xl font-black text-[#0ea5e9]">
              {data.ai_evaluation?.confidence_score || 0}%
            </p>
            <p className="text-slate-600 dark:text-gray-400 font-medium">Confidence</p>
          </div>

          <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 p-6 rounded-3xl text-center shadow-sm">
            <p className="text-3xl font-black text-[#2dd4bf]">
              {data.ai_evaluation?.speech_clarity || 0}%
            </p>
            <p className="text-slate-600 dark:text-gray-400 font-medium">Fluency</p>
          </div>

          <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 p-6 rounded-3xl text-center shadow-sm">
            <p className="text-3xl font-black text-[#8b5cf6]">
              {data.ai_evaluation?.pace || "Normal"}
            </p>
            <p className="text-slate-600 dark:text-gray-400 font-medium">Speech Rate</p>
          </div>

        </div>

        <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-black mb-3 text-[#0f172a] dark:text-white">AI Feedback</h3>
          <p className="text-slate-700 dark:text-gray-300 font-medium">{data.ai_evaluation?.ai_feedback || "No feedback available."}</p>
        </div>

        <Link
          to="/practice"
          className="inline-block px-10 py-5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-full font-bold transition-all shadow-[0_4px_14px_0_rgb(2,132,199,0.39)] transform hover:-translate-y-0.5"
        >
          Try Another Session
        </Link>

      </div>
    </DashboardLayout>
  );
};

export default Results;
