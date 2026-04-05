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
          className="bg-blue-600 hover:bg-blue-500 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold transition-all"
        >
          Start New Session
        </Link>
      </div>

      {/* Stats Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        {/* Confidence Score */}

        <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300 group">
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

        <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-300 group">
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

        <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 group">
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

        <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 hover:border-pink-500/50 transition-all duration-300 group">

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

        <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8 relative overflow-hidden">
          <h3 className="text-xl font-bold mb-8">Recent Confidence Trend</h3>

          <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-l border-gray-200 dark:border-gray-800 p-4">
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

        <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6">Recent Practice History</h3>

          <div className="space-y-6">

            {dashboardData.history_preview && dashboardData.history_preview.length > 0 ? (
              dashboardData.history_preview.map((session, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                    🎤
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">{session.topic}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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
            className="block w-full text-center mt-8 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-gray-800 transition-all"
          >
            View All Progress
          </Link>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;
