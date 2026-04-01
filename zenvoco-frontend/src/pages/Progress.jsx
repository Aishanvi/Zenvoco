import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../api/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Progress = () => {
  const navigate = useNavigate();
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
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchProgress();
  }, [navigate]);

  if (!progressData) {
    return (
      <DashboardLayout>
        <div className="text-white p-10 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium tracking-wide">Loading your progress...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- Chart Data Preparation ---
  const timeline = progressData.timeline_metrics || [];
  
  const chartData = {
    labels: timeline.map(m => new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: "Confidence Score %",
        data: timeline.map(m => m.confidence_score),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 1)",
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(59, 130, 246, 1)",
        tension: 0.4, // Smooth curve
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "#9CA3AF",
        bodyColor: "#fff",
        bodyFont: {
          weight: 'bold',
          size: 14
        },
        padding: 12,
        borderColor: "rgba(75, 85, 99, 0.5)",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Score: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
          drawBorder: false,
        },
        ticks: {
          color: "#9CA3AF",
          stepSize: 20
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#9CA3AF",
          maxRotation: 45,
          minRotation: 0
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">Progress Overview</h2>
          <p className="text-gray-400 mt-2">Track your long-term communication skills growth.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:-translate-y-1 transition-all hover:border-blue-500/50 group">
            <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-4">Latest Confidence</p>
            <p className="text-5xl font-bold text-blue-500 flex items-center gap-2 group-hover:scale-105 transition-transform duration-300 origin-left">
              {progressData.latest_confidence_score || 0}<span className="text-3xl">%</span>
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:-translate-y-1 transition-all hover:border-green-500/50 group">
            <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-4">Total Sessions</p>
            <p className="text-5xl font-bold text-green-500 group-hover:scale-105 transition-transform duration-300 origin-left">
              {progressData.total_sessions || 0}
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:-translate-y-1 transition-all hover:border-purple-500/50 group">
            <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-4">Avg Duration</p>
            <p className="text-5xl font-bold text-purple-500 flex items-end gap-2 group-hover:scale-105 transition-transform duration-300 origin-left">
              {progressData.avg_duration ? Math.floor(progressData.avg_duration / 60) : 0}<span className="text-xl text-gray-400 mb-1">m</span> {progressData.avg_duration ? progressData.avg_duration % 60 : 0}<span className="text-xl text-gray-400 mb-1">s</span>
            </p>
          </div>
        </div>

        {/* Actual Chart Section */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span>📈</span> Confidence Trend Across Sessions
          </h3>

          <div className="h-80 w-full relative z-10">
            {timeline.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl">
                <p className="text-5xl mb-4">😶</p>
                <p className="text-gray-500 font-medium">No sessions recorded yet. Start practicing!</p>
              </div>
            )}
          </div>
        </div>

        {/* Practice History Table */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-10">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span>📜</span> Practice History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="text-gray-400 border-b-2 border-gray-800">
                  <th className="pb-4 font-bold uppercase tracking-wider text-sm px-4">Date</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-sm px-4">Topic / Question</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-sm px-4">Confidence</th>
                  <th className="pb-4 font-bold uppercase tracking-wider text-sm px-4">Duration</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {timeline.length > 0 ? (
                  timeline.slice().reverse().map((session, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-black/40 transition-colors group">
                      <td className="py-5 font-medium px-4 text-gray-400">{new Date(session.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="py-5 text-gray-200 font-medium max-w-sm truncate px-4 group-hover:text-blue-400 transition-colors" title={session.topic}>
                        {session.topic || "Practice Session"}
                      </td>
                      <td className="py-5 px-4 block sm:table-cell">
                        <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold px-3 py-1 rounded-full">
                          {session.confidence_score || 0}%
                        </span>
                      </td>
                      <td className="py-5 text-purple-400 font-medium px-4">
                        {session.duration ? `${Math.floor(session.duration/60)}m ${session.duration%60}s` : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-gray-500 border border-dashed border-gray-800 rounded-xl mt-4">
                      Your practice history will appear here.
                    </td>
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