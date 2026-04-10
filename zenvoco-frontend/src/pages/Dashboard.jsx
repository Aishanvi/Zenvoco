import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get(`/dashboard/user`);
        const data = response.data;
        console.log("Dashboard API Response:", data);

        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="text-gray-900 dark:text-white p-10">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {dashboardData.user_profile?.name || "User"}! Track your communication skills journey.
          </p>
        </div>

        <Link
          to="/practice"
          className="bg-[#0284c7] hover:bg-[#0369a1] text-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_4px_14px_0_rgb(2,132,199,0.39)] transform hover:-translate-y-0.5"
        >
          Start New Session
        </Link>
      </div>

      {/* Stats Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        {/* Confidence Score */}
        <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 hover:shadow-[0_8px_30px_rgb(14,165,233,0.15)] hover:border-[#0ea5e9]/30 transition-all duration-300 group shadow-sm">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 text-2xl mb-4 group-hover:scale-110 transition-transform">
            🎯
          </div>

          <h3 className="text-gray-600 dark:text-gray-400 font-medium">Confidence Score</h3>

          <p className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">
            {dashboardData.metrics_preview?.[0]?.confidence_score || 0}
            <span className="text-xl text-blue-500">%</span>
          </p>
        </div>

        {/* Total Sessions */}
        <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 hover:shadow-[0_8px_30px_rgb(34,197,94,0.15)] hover:border-green-500/30 transition-all duration-300 group shadow-sm">
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 text-2xl mb-4 group-hover:scale-110 transition-transform">
            🔥
          </div>

          <h3 className="text-gray-600 dark:text-gray-400 font-medium">Recent Sessions</h3>

          <p className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">
            {dashboardData.history_preview?.length || 0}
            <span className="text-xl text-green-500"> Sessions</span>
          </p>
        </div>

        {/* Avg Fluency */}
        <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 hover:shadow-[0_8px_30px_rgb(168,85,247,0.15)] hover:border-purple-500/30 transition-all duration-300 group shadow-sm">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 text-2xl mb-4 group-hover:scale-110 transition-transform">
            🎙️
          </div>

          <h3 className="text-gray-600 dark:text-gray-400 font-medium">Avg Fluency</h3>

          <p className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">
            {dashboardData.metrics_preview && dashboardData.metrics_preview.length > 0
              ? Math.round(
                  dashboardData.metrics_preview.reduce((sum, m) => sum + (m.speech_clarity || 0), 0) /
                  dashboardData.metrics_preview.length
                )
              : 0}
            <span className="text-xl text-purple-500">%</span>
          </p>
        </div>

        {/* Target Progress */}
        <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 hover:shadow-[0_8px_30px_rgb(236,72,153,0.15)] hover:border-pink-500/30 transition-all duration-300 group shadow-sm">

          <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 text-2xl mb-4 group-hover:scale-110 transition-transform">
            📉
          </div>

          <h3 className="text-gray-600 dark:text-gray-400 font-medium">
            Overall Progress
          </h3>

          <p className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">
            {dashboardData.metrics_preview?.length ? "On Track" : "Starting"}
            <span className="text-xl text-pink-500"></span>
          </p>

        </div>

      </div> {/* ✅ CLOSED Stats Grid */}

      {/* Charts + Activity */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Confidence Chart - Quick Bar Chart */}
        <div className="lg:col-span-2 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 relative overflow-hidden shadow-sm">
          <h3 className="text-xl font-black text-[#0f172a] dark:text-white mb-8 tracking-tight">Recent Confidence Trend</h3>

          <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-l border-[#0ea5e9]/10 dark:border-gray-800 p-4">
            {dashboardData.metrics_preview && dashboardData.metrics_preview.length > 0 ? (
              dashboardData.metrics_preview.slice(0, 5).reverse().map((m, i) => (
                <div key={i} className="w-full bg-blue-600/50 rounded-t-lg transition-all" style={{ height: `${m.confidence_score || 10}%` }}></div>
              ))
            ) : (
              <p className="text-gray-500 text-center w-full pb-10">No practice data yet. Start a session!</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-black text-[#0f172a] dark:text-white mb-6 tracking-tight">Recent Practice History</h3>

          <div className="space-y-4">

            {dashboardData.history_preview && dashboardData.history_preview.length > 0 ? (
              dashboardData.history_preview.map((session, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/50 dark:bg-black/40 p-3 rounded-2xl border border-[#0ea5e9]/5 transition-all hover:border-[#0ea5e9]/20">
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center text-[#0ea5e9] border border-[#0ea5e9]/20 shadow-[0_4px_10px_rgb(14,165,233,0.1)]">
                    🎤
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white line-clamp-1">{session.topic}</h4>
                    <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No activity recorded yet.</p>
            )}

          </div>

          <Link
            to="/progress"
            className="block w-full text-center mt-8 py-3 rounded-full border border-slate-300 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:text-slate-900 hover:border-[#0ea5e9]/30 font-bold dark:text-white hover:bg-slate-50 dark:bg-gray-800 transition-all shadow-sm"
          >
            View All Progress
          </Link>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;
