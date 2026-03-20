/**
 * AudioInput — Reusable dual-mode audio capture component.
 *
 * Props:
 *  onAudioReady(blob, durationSec) — called whenever audio is ready (recorded or uploaded)
 *  onReset()                       — called when the user clears the current audio
 *  disabled                        — disables all controls (e.g. while parent is uploading)
 *  compact                         — renders a smaller variant (no waveform, smaller mic)
 */
import React, { useState, useRef, useEffect } from "react";

const ACCEPTED = "audio/webm,audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/m4a,audio/aac,audio/*";

const AudioInput = ({ onAudioReady, onReset, disabled = false, compact = false }) => {
  const [mode, setMode]         = useState("record");   // "record" | "upload"
  const [phase, setPhase]       = useState("idle");     // idle | recording | ready
  const [elapsed, setElapsed]   = useState(0);
  const [fileName, setFileName] = useState("");
  const [blob, setBlob]         = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const timerRef         = useRef(null);
  const startTimeRef     = useRef(null);
  const fileInputRef     = useRef(null);

  // Clean up on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current);
    stopMicStream();
  }, []);

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const stopMicStream = () => {
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
  };

  // ─── Reset everything ─────────────────────────────────────────────────────
  const handleReset = () => {
    clearInterval(timerRef.current);
    stopMicStream();
    setPhase("idle");
    setBlob(null);
    setFileName("");
    setElapsed(0);
    onReset?.();
  };

  // Switch mode clears any existing audio
  const switchMode = (m) => {
    if (phase === "recording") return; // can't switch while recording
    handleReset();
    setMode(m);
  };

  // ─── Microphone recording ─────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr     = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current        = [];

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const recorded = new Blob(chunksRef.current, { type: "audio/webm" });
        const dur      = Math.round((Date.now() - startTimeRef.current) / 1000);
        setBlob(recorded);
        setElapsed(dur);
        setPhase("ready");
        setFileName(`Recording (${fmtTime(dur)})`);
        onAudioReady?.(recorded, dur);
      };

      mr.start();
      startTimeRef.current = Date.now();
      setPhase("recording");
      setElapsed(0);

      timerRef.current = setInterval(
        () => setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000)),
        500
      );
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Microphone access is required. Please allow it in your browser and try again.");
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    // onstop callback handles the rest
  };

  // ─── File upload ──────────────────────────────────────────────────────────
  const processFile = (file) => {
    if (!file) return;
    // Basic type check
    if (!file.type.startsWith("audio/")) {
      alert("Please select a valid audio file (.mp3, .wav, .webm, .ogg, .m4a, .aac).");
      return;
    }
    // Size guard — 50 MB max
    if (file.size > 50 * 1024 * 1024) {
      alert("File is too large. Please upload an audio file under 50 MB.");
      return;
    }

    // Use the File directly as Blob (no ArrayBuffer conversion needed)
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      const dur = isFinite(audio.duration) ? Math.round(audio.duration) : Math.round(file.size / 16000);
      URL.revokeObjectURL(url);
      setBlob(file);
      setFileName(file.name);
      setPhase("ready");
      onAudioReady?.(file, dur);
    });
    audio.addEventListener("error", () => {
      // Fallback if browser can't decode metadata
      const dur = Math.round(file.size / 16000);
      URL.revokeObjectURL(url);
      setBlob(file);
      setFileName(file.name);
      setPhase("ready");
      onAudioReady?.(file, dur);
    });
  };

  const onFileChange = (e) => processFile(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  const micSize  = compact ? "w-20 h-20 text-4xl" : "w-36 h-36 text-6xl";

  return (
    <div className="space-y-4">

      {/* Mode toggle tabs */}
      {phase !== "ready" && (
        <div className="flex gap-2 p-1 bg-gray-900 border border-gray-800 rounded-2xl w-fit">
          <button
            onClick={() => switchMode("record")}
            disabled={disabled || phase === "recording"}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === "record"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🎤 Record Mic
          </button>
          <button
            onClick={() => switchMode("upload")}
            disabled={disabled || phase === "recording"}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === "upload"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            📂 Upload File
          </button>
        </div>
      )}

      {/* ── RECORD mode ── */}
      {mode === "record" && phase !== "ready" && (
        <div className={`flex flex-col items-center gap-6 ${compact ? "" : "py-4"}`}>

          {/* Waveform animation */}
          {phase === "recording" && (
            <div className="flex gap-1 items-end h-10">
              {Array.from({ length: compact ? 12 : 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-red-500/80 rounded-full animate-pulse"
                  style={{ height: `${10 + (i % 5) * 5}px`, animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>
          )}

          {/* Timer */}
          {phase === "recording" && (
            <p className="text-red-400 font-bold text-lg flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse inline-block" />
              Recording… {fmtTime(elapsed)}
            </p>
          )}

          {/* Mic button */}
          <div className="relative flex justify-center">
            {phase === "recording" && (
              <>
                <div className="absolute inset-0 bg-red-500/15 rounded-full blur-xl animate-ping" />
                <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl animate-pulse" />
              </>
            )}
            <button
              onClick={phase === "recording" ? stopRecording : startRecording}
              disabled={disabled}
              className={`relative z-10 ${micSize} rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                phase === "recording"
                  ? "bg-red-600 scale-110 shadow-[0_0_50px_rgba(220,38,38,0.5)]"
                  : "bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:border-gray-500 hover:scale-105"
              }`}
            >
              🎤
            </button>
          </div>

          <p className="text-gray-400 text-sm text-center">
            {phase === "idle"
              ? "Click the microphone to start recording"
              : "Click again to stop"}
          </p>
        </div>
      )}

      {/* ── UPLOAD mode ── */}
      {mode === "upload" && phase !== "ready" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
            dragOver
              ? "border-blue-400 bg-blue-500/10 scale-[1.01]"
              : "border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED}
            onChange={onFileChange}
            className="hidden"
          />
          <div className="text-5xl mb-4">📂</div>
          <p className="text-white font-semibold text-lg mb-2">
            {dragOver ? "Drop it here!" : "Drag & drop an audio file"}
          </p>
          <p className="text-gray-400 text-sm mb-4">or click to browse</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["MP3", "WAV", "WEBM", "OGG", "M4A", "AAC"].map((ext) => (
              <span key={ext} className="text-xs bg-gray-800 border border-gray-700 text-gray-400 px-3 py-1 rounded-full font-mono">
                .{ext.toLowerCase()}
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-4">Max file size: 50 MB</p>
        </div>
      )}

      {/* ── READY state (both modes) ── */}
      {phase === "ready" && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold shrink-0">
              ✓
            </div>
            <div>
              <p className="text-green-400 font-semibold text-sm">Audio ready</p>
              <p className="text-gray-400 text-sm truncate max-w-xs">{fileName}</p>
            </div>
          </div>
          {!disabled && (
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-all shrink-0"
            >
              ↺ Clear & redo
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default AudioInput;
