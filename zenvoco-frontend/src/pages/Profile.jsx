import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://127.0.0.1:8000" : "https://zenvoco.onrender.com");

        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        console.log("Profile API Response:", data);

        setProfile(data);

      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="text-white p-10">Loading profile...</div>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-10">

        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">
            Profile Settings
          </h2>
          <p className="text-gray-400 mt-2">
            Manage your account and preferences.
          </p>
        </div>

        {/* Profile Header */}

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 flex items-center gap-8 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center text-4xl font-bold text-white">
              {profile.name?.charAt(0) || "U"}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-3xl font-bold text-white mb-1">
              {profile.name || "User"}
            </h3>

            <p className="text-gray-400 mb-3">
              {profile.email || "email@example.com"}
            </p>

            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
              {profile.purpose || "Communication Improvement"}
            </span>
          </div>

          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all font-medium border border-gray-700">
            Edit Profile
          </button>

        </div>

        {/* Editable Fields Grid */}

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all">
            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-2">
              Current Purpose
            </p>

            <p className="text-2xl font-bold text-blue-400 flex items-center gap-3">
              <span>🎯</span> {profile.purpose || "Interview Preparation"}
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-purple-500/30 transition-all">
            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-2">
              Skill Level
            </p>

            <p className="text-2xl font-bold text-purple-400 flex items-center gap-3">
              <span>⭐</span> {profile.skill_level || "Intermediate"}
            </p>
          </div>

        </div>

        {/* Stats Section */}

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 mt-8">

          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <span>📈</span> All-Time Statistics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            <div className="text-center p-6 bg-black/40 border border-gray-800 rounded-2xl">
              <p className="text-4xl font-bold text-green-400 mb-2">
                {profile.total_sessions || 0}
              </p>
              <p className="text-gray-400 text-sm font-medium">
                Total Sessions
              </p>
            </div>

            <div className="text-center p-6 bg-black/40 border border-gray-800 rounded-2xl">
              <p className="text-4xl font-bold text-blue-400 mb-2">
                {profile.avg_confidence || 0}%
              </p>
              <p className="text-gray-400 text-sm font-medium">
                Avg Confidence
              </p>
            </div>

            <div className="text-center p-6 bg-black/40 border border-gray-800 rounded-2xl">
              <p className="text-4xl font-bold text-purple-400 mb-2">
                {profile.streak || 0}
              </p>
              <p className="text-gray-400 text-sm font-medium">
                Day Streak
              </p>
            </div>

            <div className="text-center p-6 bg-black/40 border border-gray-800 rounded-2xl">
              <p className="text-4xl font-bold text-pink-400 mb-2">
                {profile.tier || "Bronze"}
              </p>
              <p className="text-gray-400 text-sm font-medium">
                Current Tier
              </p>
            </div>

          </div>

        </div>

        {/* Logout */}

        <div className="pt-6">

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-bold transition-all w-full md:w-auto"
          >
            Sign Out
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;