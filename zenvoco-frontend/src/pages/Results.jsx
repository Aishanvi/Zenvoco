import React from "react";
import { useLocation, Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";

const Results = () => {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return <div className="text-gray-900 dark:text-white p-10">No results available</div>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">

        <h2 className="text-4xl font-bold">Speech Analysis Result</h2>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl text-center">
            <p className="text-3xl font-bold text-blue-400">
              {data.ai_evaluation?.confidence_score || 0}%
            </p>
            <p className="text-gray-600 dark:text-gray-400">Confidence</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl text-center">
            <p className="text-3xl font-bold text-green-400">
              {data.ai_evaluation?.speech_clarity || 0}%
            </p>
            <p className="text-gray-600 dark:text-gray-400">Fluency</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl text-center">
            <p className="text-3xl font-bold text-purple-400">
              {data.ai_evaluation?.pace || "Normal"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Speech Rate</p>
          </div>

        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-3">AI Feedback</h3>
          <p className="text-gray-700 dark:text-gray-300">{data.ai_evaluation?.ai_feedback || "No feedback available."}</p>
        </div>

        <Link
          to="/practice"
          className="inline-block bg-blue-600 px-6 py-3 rounded-xl font-bold"
        >
          Try Another Session
        </Link>

      </div>
    </DashboardLayout>
  );
};

export default Results;
