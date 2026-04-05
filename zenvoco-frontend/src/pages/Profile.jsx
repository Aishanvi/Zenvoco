import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../api/api";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get(`/user/profile`);
        const data = response.data;
        console.log("Profile API Response:", data);

        setProfile(data);

      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-gray-900 dark:text-white p-10">Loading profile...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-10">

        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">
            Profile Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account and preferences.
          </p>
        </div>

        {/* Profile Header */}

        <div className="bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-10 flex items-center gap-8 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <div className="w-full h-full bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-4xl font-bold text-gray-900 dark:text-white">
              {profile.name?.charAt(0) || "U"}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {profile.name || "User"}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {profile.email || "email@example.com"}
            </p>

            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
              {profile.purpose || "Communication Improvement"}
            </span>
          </div>

          <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl transition-all font-medium border border-gray-300 dark:border-gray-700">
            Edit Profile
          </button>

        </div>

        {/* Cleaned Profile: Removed mock statistics as requested */}

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