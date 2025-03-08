"use client";
import React, { useState, useEffect } from "react";
import withAuth from "@/components/Auth/withAuth";
import Link from "next/link";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import Navbar from "@/components/Navbar/Navbar";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import ExamHeader from "@/components/TakeExam/ExamHeader";
import fetchExamData from "@/lib/takeExamMethods/fetchExam";
import submitExam from "@/lib/takeExamMethods/submitExam";
import ExamSections from "@/components/TakeExam/ExamSections";
import DetailedResults from "@/components/TakeExam/DetailedResults";
import "katex/dist/katex.min.css";

import {
  Loader,
  Search,
  Check,
  PlayCircle,
  Home,
  ChevronUp,
  X,
  Clock,
} from "lucide-react";
// import saveProgress from "@/lib/TakeExamMethods/saveProgress";

function Page() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Take Exam", href: "/take-exam" },
  ];
  const [slug, setSlug] = useState("");
  const [examData, setExamData] = useState(null);
  const [error, setError] = useState(null);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(true);
  const [warningCount, setWarningCount] = useState(0);
  const [tabSwitchTimestamps, setTabSwitchTimestamps] = useState([]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Required for modern browsers to show a confirmation dialog.
      return ""; // Fallback for older browsers.
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab switch detected, capture the timestamp and the tab index (or tab name)
        const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
        setTabSwitchTimestamps((prevTimestamps) => [
          ...prevTimestamps,
          { timestamp, tab: "hidden" },
        ]);

        setWarningCount((prevCount) => {
          const newCount = prevCount + 1;
          if (newCount >= 3) {
            console.log(
              "You have been logged out due to multiple tab switches."
            );
            // Add your logout or exam submission logic here
          } else {
            console.log(`Tab switched! Warning #${newCount}`);
          }
          return newCount;
        });
      } else {
        // Tab becomes visible again, log the timestamp
        const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
        setTabSwitchTimestamps((prevTimestamps) => [
          ...prevTimestamps,
          { timestamp, tab: "visible" },
        ]);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (examData) {
      // Check if the current time is within the exam period
      const interval = setInterval(() => {
        const now = moment();
        const canStartExam = now.isBetween(
          moment(examData.startDate),
          moment(examData.endDate)
        );
        setIsStartButtonDisabled(!canStartExam);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [examData]);
  // Fetch exam based on slug
  const fetchExam = async (e) => {
    e.preventDefault();
    await fetchExamData(
      slug,
      setExamData,
      setAnswers,
      setTimeLeft,
      setLoading,
      setError
    );
  };

  // Handle the start of the exam and timer
  const startExam = () => {
    let violences = {
      cursorViolence: {
        cursorCount: warningCount,
        tabSwitchTimestamps,
      },
    };
    setIsExamStarted(true);
    setTimeTaken(0);
    // Calculate total duration of the exam in seconds
    const totalDurationInSeconds = moment(examData.endDate).diff(
      moment(examData.startDate),
      "seconds"
    );
    setTimer(
      setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        // Calculate the time taken based on total duration - time left
        setTimeTaken(totalDurationInSeconds - timeLeft);

        if (timeLeft <= 0) {
          clearInterval(timer);
          submitExam(
            examData,
            answers,
            timeTaken,
            timer,
            setExamData,
            setIsExamStarted,
            setScore,
            violences
          );
        }
      }, 1000)
    );
  };

  // Handle answer selection
  const handleOptionChange = (questionIndex, option) => {
    setAnswers({
      ...answers,
      [questionIndex]: option,
    });
    // Save progress to the database
    //saveProgress(questionIndex, option, examData); // Save progress whenever an answer is selected
  };

  // Confirmation before submitting manually
  const confirmSubmit = () => {
    let violences = {
      cursorViolence: {
        cursorCount: warningCount,
        tabSwitchTimestamps,
      },
    };
    if (window.confirm("Do you want to submit the exam?")) {
      submitExam(
        examData,
        answers,
        timeTaken,
        timer,
        setExamData,
        setIsExamStarted,
        setScore,
        violences
      );
    }
  };

  const confirmCancel = () => {
    let violences = {
      cursorViolence: {
        cursorCount: warningCount,
        tabSwitchTimestamps,
      },
    };
    const cancelExam = window.confirm(
      "Are you sure you want to cancel the exam? This will submit your current answers."
    );

    if (cancelExam) {
      submitExam(
        examData,
        answers,
        timeTaken,
        timer,
        setExamData,
        setIsExamStarted,
        setScore,
        violences
      );
    }
  };

  // Reset the exam for a retake
  // const retakeExam = () => {
  //   setAnswers({});
  //   setScore(null);
  //   setTimeTaken(0);
  //   setIsExamStarted(false);
  //   setTimer(null);
  //   setTimeLeft(examData.duration * 60);
  // };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {!examData ? (
            // Exam Code Input Section
            <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Enter Exam Code
                </h1>
                <p className="text-gray-600 mt-1">
                  Please enter your exam code to begin
                </p>
              </div>
              <form onSubmit={fetchExam} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter exam code (e.g., general-knowledge-1)"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin w-5 h-5 text-current" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 text-current" />
                      <span>Fetch Exam</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Exam Header */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {examData.examName}
                    </h1>
                    {isExamStarted && (
                      <p className="text-gray-600 mt-1">
                        Complete all questions before the timer ends
                      </p>
                    )}
                  </div>
                  {isExamStarted && (
                    <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2">
                      <ChevronUp className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-medium text-blue-900">
                        Remaining Time: {Math.floor(timeLeft / 60)}m{" "}
                        {timeLeft % 60}s
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isExamStarted ? (
                // Questions Section
                <div className="space-y-6">
                  <ExamSections
                    questions={examData.questions}
                    answers={answers}
                    onOptionChange={handleOptionChange}
                  />

                  {/* Action Buttons */}
                  <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
                    <button
                      onClick={confirmSubmit}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5 text-current" strokeWidth={2} />
                      Submit Exam
                    </button>
                    <button
                      onClick={confirmCancel}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5 text-current" />
                      Cancel Exam
                    </button>
                  </div>
                </div>
              ) : score === null ? (
                // Exam Start Section
                <div className="bg-white rounded-lg shadow-md p-6">
                  <ExamHeader examData={examData} />
                  <div className="flex justify-center gap-4 mt-8">
                    <button
                      onClick={startExam}
                      disabled={isStartButtonDisabled}
                      className={`px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 flex items-center gap-2
                      ${
                        isStartButtonDisabled
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      <PlayCircle
                        className="w-5 h-5 text-current"
                        strokeWidth={2}
                      />
                      Start Exam
                    </button>
                    <Link href="/">
                      <span className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors duration-200 flex items-center gap-2">
                        <Home
                          className="w-5 h-5 text-current"
                          strokeWidth={2}
                        />
                        Go back home
                      </span>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {examData.showResult ? (
                    <div className="space-y-6">
                      {/* Score Overview */}
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center">
                          <h2 className="text-3xl font-bold text-gray-900">
                            Your Score: {score} / {examData.totalMarks}
                          </h2>
                          <p className="text-gray-600 mt-2">
                            Time Taken: {Math.floor(timeTaken / 60)}m{" "}
                            {timeTaken % 60}s
                          </p>
                        </div>
                      </div>

                      {/* Detailed Results */}
                      <DetailedResults
                        results={examData.results}
                        answers={answers}
                      />
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <Clock className="w-12 h-12 text-gray-400" />{" "}
                        {/* Lucide Clock Icon */}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Results Are Being Processed
                      </h2>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Your results are currently being reviewed and will be
                        available within the next 12 hours. Thank you for your
                        patience!
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
}

export default withAuth(Page);
