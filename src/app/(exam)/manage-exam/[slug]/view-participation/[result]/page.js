"use client";

import React, { useState, useEffect, use } from "react";
import withAuth from "@/components/Auth/withAuth";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Brain,
  AlertTriangle,
} from "lucide-react";

import Navbar from "@/components/Navbar/Navbar";
import Loader from "@/components/Common/Loader";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import TabSwitchTimeline from "@/components/Cheating/TabSwitchTimeline";
import processText from "@/lib/textUtilities/processText";
import renewAccessToken from "@/lib/token/renewAccessToken";

function ViewPerformance({ params }) {
  const { result, slug } = use(params);
  // let examName1 = slug.examName
  const [performance, setPerformance] = useState(null);
  const [showCheatingDetails, setShowCheatingDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Exam", href: "/manage-exam" },
    { label: `${slug}`, href: `/manage-exam/${slug}/view-participation` },
    {
      label: "View Participation",
      href: `/manage-exam/${slug}/view-participation`,
    },
    {
      label: `${result}`,
      href: `/manage-exam/${slug}/view-participation/${result}`,
    },
  ];

  useEffect(() => {
    if (slug) {
      fetchPerformance();
    }
  }, [slug]);

  const fetchPerformance = async () => {
    try {
      let token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/view-participation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token here
          },
          body: JSON.stringify({ examName: slug, username: result }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch performance data.");
      }

      const data = await response.json();
      if (data.success) {
        setPerformance(data.results); // Use the correct data structure
      } else {
        throw new Error(data.message || "Failed to fetch performance data.");
      }
    } catch (err) {
      console.error("Error fetching performance:", err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false); // Stop loading regardless of success/failure
    }
  };

  if (loading) return <Loader></Loader>;
  if (error) return <div>Error: {error}</div>;

  if (!performance) {
    return <div>No performance data found.</div>;
  }

  const {
    examName,
    questions,
    answers,
    timeTaken,
    violences,
    startDate,
    endDate,
  } = performance;
  // Calculate statistics
  const totalQuestions = questions.length;
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
  const wrongAnswers = totalQuestions - correctAnswers;
  const scorePercentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);

  // Format time taken (assuming timeTaken is in seconds)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* Exam Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h1 className="text-2xl font-bold text-gray-800">{examName}</h1>
            <p className="text-gray-600 mt-2">Performance Analysis</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-black">
            {/* Score Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-gray-600">Score</h3>
              </div>
              <p className="text-3xl font-bold mt-2">
                {scorePercentage}%
              </p>
            </div>

            {/* Time Taken Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-500" />
                <h3 className="text-gray-600">Time Taken</h3>
              </div>
              <p className="text-3xl font-bold mt-2">
                {formatTime(timeTaken)}
              </p>
            </div>

            {/* Correct Answers Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="text-gray-600">Correct</h3>
              </div>
              <p className="text-3xl font-bold mt-2">
                {correctAnswers}/{totalQuestions}
              </p>
            </div>

            {/* Wrong Answers Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-gray-600">Wrong</h3>
              </div>
              <p className="text-3xl font-bold mt-2">
                {wrongAnswers}/{totalQuestions}
              </p>
            </div>
            {/* Cheating Count Card with Link */}
            <div
              className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition"
              onClick={() => setShowCheatingDetails(!showCheatingDetails)}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-gray-600">Cheating Count</h3>
              </div>
              <p className="text-3xl font-bold mt-2 text-black">
                {violences.cursorViolence.cursorCount}
              </p>
            </div>
          </div>
          {showCheatingDetails && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800">
                Cheating Details
              </h2>
              <p className="text-gray-600 mt-2">
                Cursor Violations: {violences.cursorViolence.cursorCount}
              </p>
              <TabSwitchTimeline
                violences={violences}
                startDate={startDate}
                endDate={endDate}
              ></TabSwitchTimeline>
            </div>
          )}
          {/* Questions Section */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-bold text-black">
                Questions and Answers
              </h2>
            </div>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = answers.find(
                  (ans) => ans.question === question.question
                );

                return (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-gray-600 font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="question-container">
                          <h3
                            className="font-semibold text-gray-800"
                            dangerouslySetInnerHTML={{
                              __html: processText(question.question),
                            }}
                          ></h3>
                        </div>

                        <div className="mt-3 space-y-2">
                          {question.options.map((option, i) => {
                            const optionLetter = String.fromCharCode(97 + i);
                            const isUserAnswer =
                              userAnswer?.userAnswer === optionLetter;
                            const isCorrectAnswer =
                              userAnswer?.correctAnswer === optionLetter;

                            return (
                              <div
                                key={i}
                                className={`p-2 rounded ${
                                  isUserAnswer
                                    ? userAnswer.isCorrect
                                      ? "bg-green-50"
                                      : "bg-red-50"
                                    : isCorrectAnswer
                                    ? "bg-green-50"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center gap-2 text-black">
                                  <span className="font-medium">
                                    {optionLetter}.
                                  </span>

                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: processText(`${option}`),
                                    }}
                                  ></span>
                                  {isUserAnswer && (
                                    <span className="ml-2">
                                      {userAnswer.isCorrect ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* Show "No Answer" if userAnswer is undefined */}
                        {!userAnswer?.userAnswer && (
                          <div className="mt-2 flex items-center text-red-500">
                            <XCircle className="w-5 h-5 mr-1" />
                            <span>No Answer</span>
                          </div>
                        )}
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-black">
                              Explanation:
                            </span>{" "}
                            <p
                              className="text-sm text-gray-600"
                              dangerouslySetInnerHTML={{
                                __html: processText(question.explanation),
                              }}
                            ></p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(ViewPerformance);
