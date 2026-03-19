import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://127.0.0.1:8000" : "https://zenvoco.onrender.com");

        const response = await fetch(`${API_BASE_URL}/dashboard/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Dashboard API Response:", data);

        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);

  if (!dashboardData) {
    return <div className="text-white p-10">Loading dashboard...</div>;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-gray-400 mt-2">
            Track your communication skills journey.
          </p>
        </div>

        <Link
          to="/practice"
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
        >
          Start New Session
        </Link>
      </div>

      {/* Stats Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        {/* Confidence Score */}

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-300 group">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 text-2xl mb-4 group-hover:scale-110 transition-transform">
            🎯
          </div>

          <h3 className="text-gray-400 font-medium">Confidence Score</h3>

          <p className="text-4xl font-bold mt-2 text-white">
            {dashboardData.confidence_score || 0}
            <span className="text-xl text-blue-500">%</span>
          </p>
        </div>

        {/* Streak */}

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-300 group">
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 text-2xl mb-4 group-hover:scale-110 transition-transform">
            🔥
          </div>

          <h3 className="text-gray-400 font-medium">Current Streak</h3>

          <p className="text-4xl font-bold mt-2 text-white">
            {dashboardData.streak || 0}
            <span className="text-xl text-green-500"> Days</span>
          </p>
        </div>

        {/* Average Fluency */}

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 group">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 text-2xl mb-4 group-hover:scale-110 transition-transform">
            🎙️
          </div>

          <h3 className="text-gray-400 font-medium">Average Fluency</h3>

          <p className="text-4xl font-bold mt-2 text-white">
            {dashboardData.avg_fluency || 0}
            <span className="text-xl text-purple-500">%</span>
          </p>
        </div>

        {/* Anxiety Reduction */}

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-pink-500/50 transition-all duration-300 group">

          <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500 text-2xl mb-4 group-hover:scale-110 transition-transform">
            📉
          </div>

          <h3 className="text-gray-400 font-medium">
            Anxiety Reduction
          </h3>

          <p className="text-4xl font-bold mt-2 text-white">
            {dashboardData.anxiety_reduction || 0}
            <span className="text-xl text-pink-500">%</span>
          </p>

        </div>

      </div> {/* ✅ CLOSED Stats Grid */}

      {/* Charts + Activity */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Confidence Chart */}

        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
          <h3 className="text-xl font-bold mb-8">Confidence Trend</h3>

          <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-l border-gray-800 p-4">
            <div className="w-full bg-blue-600/20 rounded-t-lg h-[40%]"></div>
            <div className="w-full bg-blue-600/20 rounded-t-lg h-[45%]"></div>
            <div className="w-full bg-blue-600/20 rounded-t-lg h-[55%]"></div>
            <div className="w-full bg-blue-600/20 rounded-t-lg h-[70%]"></div>
            <div className="w-full bg-blue-600/50 rounded-t-lg h-[78%]"></div>
          </div>
        </div>

        {/* Recent Activity */}

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>

          <div className="space-y-6">

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                🎤
              </div>
              <div>
                <h4 className="font-medium text-white">Guided Practice</h4>
                <p className="text-sm text-gray-400">Today, 10:30 AM</p>
              </div>
            </div>

          </div>

          <Link
            to="/progress"
            className="block w-full text-center mt-8 py-3 rounded-xl border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
          >
            View All Progress
          </Link>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;
