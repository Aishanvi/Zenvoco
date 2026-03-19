import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import axios from "axios";

const GuidedPractice = () => {

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const navigate = useNavigate();

  // ✅ START SESSION API
  const startSession = async () => {
    try {
      const res = await axios.post("/practice/start", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      return res.data.session_id;
    } catch (err) {
      console.error("Error starting session", err);
    }
  };

  // 🎤 START RECORDING
  const startRecording = async () => {
    try {
      console.log("Mic clicked - start recording");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        console.log("Recording finished. Blob size:", blob.size);

        setAudioBlob(blob);
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setRecording(true);

    } catch (error) {
      console.error("Microphone error:", error);
    }
  };

  // 🛑 STOP RECORDING
  const stopRecording = () => {
    console.log("Stopping recording");

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    setRecording(false);
  };

  // 🚀 UPLOAD AUDIO (FIXED)
  const uploadAudio = async () => {
    try {
      console.log("Uploading audio...");

      const token = localStorage.getItem("token");

      // ✅ STEP 1: Start session
      const session_id = await startSession();
      console.log("Session ID:", session_id);

      // ✅ STEP 2: Prepare correct form data
      const formData = new FormData();
      formData.append("audio", audioBlob);   // FIXED
      formData.append("session_id", session_id); // REQUIRED

      const API_BASE_URL =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV
          ? "http://127.0.0.1:8000"
          : "https://zenvoco.onrender.com");

      const response = await fetch(`${API_BASE_URL}/practice/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      console.log("Speech Analysis:", data);

      // ✅ STEP 3: Navigate to results page
      navigate("/results", { state: data });

    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-10">

        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">
            Guided Practice
          </h2>
          <p className="text-gray-400 mt-2">
            Practice speaking with AI guidance.
          </p>
        </div>

        {/* Topic Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">
            📝 Today’s Topic
          </h3>
          <p className="text-xl text-white italic border-l-4 border-purple-500 pl-6 py-2">
            "Describe a challenging situation you faced and how you handled it."
          </p>
        </div>

        {/* Recording Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-16 text-center">

          <p className="text-xl text-gray-300 mb-10">
            {recording
              ? "Listening carefully..."
              : "Ready when you are. Click microphone to start."}
          </p>

          {/* MIC BUTTON */}
          <div className="flex justify-center mb-10">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl transition-all duration-300 ${
                recording
                  ? "bg-red-600 text-white scale-110"
                  : "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              🎤
            </button>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-center gap-6 mt-12">

            <button
              onClick={uploadAudio}
              disabled={!audioBlob}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
            >
              Finish & Analyze
            </button>

            <button
              onClick={() => {
                setRecording(false);
                setAudioBlob(null);
                audioChunksRef.current = [];
              }}
              className="px-8 py-4 border border-gray-700 text-white rounded-xl"
            >
              Reset
            </button>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default GuidedPractice;