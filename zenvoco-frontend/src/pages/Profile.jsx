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
        <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl border border-[#0ea5e9]/10 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0ea5e9]/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="w-28 h-28 shrink-0 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#2dd4bf] p-1 shadow-[0_4px_14px_0_rgb(14,165,233,0.39)]">
            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-4xl font-black text-slate-800 dark:text-white">
              {profile.name?.charAt(0) || "U"}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black text-[#0f172a] dark:text-white mb-1 tracking-tight">
              {profile.name || "User"}
            </h3>

            <p className="text-slate-500 font-medium mb-4">
              {profile.email || "email@example.com"}
            </p>

            <span className="bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
              {profile.purpose || "Communication Improvement"}
            </span>
          </div>

          <button className="px-6 py-3 bg-white hover:bg-slate-50 dark:bg-gray-800 text-slate-700 dark:text-white rounded-full transition-all font-bold border border-[#0ea5e9]/20 shadow-sm mt-4 md:mt-0">
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
            className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition-all w-full md:w-auto shadow-[0_4px_14px_0_rgb(239,68,68,0.39)] transform hover:-translate-y-0.5"
          >
            Sign Out
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;