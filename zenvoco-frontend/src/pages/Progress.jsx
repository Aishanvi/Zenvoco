import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../api/api";

const Progress = () => {
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await API.get(`/progress/`);
        const data = response.data;
        console.log("Progress API Response:", data);
        setProgressData(data);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, []);

  if (!progressData) {
    return (
      <DashboardLayout>
        <div className="text-white p-10">Loading progress...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">Progress Overview</h2>
          <p className="text-gray-400 mt-2">Track your long-term communication skills growth.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:-translate-y-1 transition-all hover:border-blue-500/50">
            <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-4">Latest Confidence</p>
            <p className="text-5xl font-bold text-blue-500 flex items-center gap-2">
              {progressData.latest_confidence_score || 0}<span className="text-2xl">%</span>
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:-translate-y-1 transition-all hover:border-green-500/50">
            <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-4">Total Sessions</p>
            <p className="text-5xl font-bold text-green-500">{progressData.total_sessions || 0}</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:-translate-y-1 transition-all hover:border-purple-500/50">
            <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-4">Avg Duration</p>
            <p className="text-5xl font-bold text-purple-500 flex items-end gap-2">
              {progressData.avg_duration ? Math.floor(progressData.avg_duration / 60) : 0}<span className="text-xl text-gray-400 mb-1">m</span> {progressData.avg_duration ? progressData.avg_duration % 60 : 0}<span className="text-xl text-gray-400 mb-1">s</span>
            </p>
          </div>
        </div>

        {/* Mock Chart Section */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span>📈</span> Confidence Trend
          </h3>

          <div className="h-72 flex flex-col justify-end border-l-2 border-b-2 border-gray-800 p-6 gap-6 relative">
            <div className="absolute top-4 left-4 right-4 border-b border-gray-800/50 border-dashed"></div>
            <div className="absolute top-1/2 left-4 right-4 border-b border-gray-800/50 border-dashed"></div>
            <div className="absolute top-1/4 left-4 right-4 border-b border-gray-800/50 border-dashed"></div>
            <div className="absolute top-3/4 left-4 right-4 border-b border-gray-800/50 border-dashed"></div>

            <div className="relative z-10 w-full h-full flex items-end justify-between px-2 gap-2">
              {/* Bars */}
              {progressData.timeline_metrics && progressData.timeline_metrics.length > 0 ? (
                progressData.timeline_metrics.slice(-10).map((m, i) => (
                  <div key={i} className="flex-1 bg-blue-600/50 hover:bg-blue-600/70 transition-all rounded-t-xl border-t-2 border-blue-400 flex justify-center group relative cursor-pointer" style={{ height: `${m.confidence_score || 10}%` }}>
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white px-2 py-1 rounded text-xs transition-opacity">{m.confidence_score || 0}%</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center w-full pb-10">No sessions recorded yet</p>
              )}
            </div>

            <div className="flex justify-between w-full text-sm text-gray-500 font-medium px-2 mt-2">
              {progressData.timeline_metrics && progressData.timeline_metrics.length > 0 && progressData.timeline_metrics.slice(-5).map((m, i) => (
                <span key={i}>{new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Practice History Table */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-10">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span>📜</span> Practice History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 border-b-2 border-gray-800">
                  <th className="pb-4 font-bold uppercase tracking-wider text-sm">Date</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-sm">Topic</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-sm">Confidence</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-sm">Duration</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {progressData.timeline_metrics && progressData.timeline_metrics.length > 0 ? (
                  progressData.timeline_metrics.slice().reverse().map((session, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-black/20 transition-colors">
                      <td className="py-5 font-medium">{new Date(session.date).toLocaleDateString()}</td>
                      <td className="text-gray-300 max-w-xs truncate">{session.topic || "Practice Session"}</td>
                      <td className="text-blue-400 font-bold">{session.confidence_score}%</td>
                      <td className="text-purple-400 font-medium">{session.duration ? `${Math.floor(session.duration/60)}m ${session.duration%60}s` : "-"}</td>
                      <td className="text-right"><button className="text-blue-500 hover:text-white transition-colors">Review</button></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-5 text-center text-gray-500">No practice history available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Progress;