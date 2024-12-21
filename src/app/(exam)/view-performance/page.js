"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import withAuth from "@/components/Auth/withAuth";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import "moment-duration-format";
import Navbar from "@/components/Navbar/Navbar";
import Loader from "@/components/Common/Loader";
import {
  Clock,
  Trophy,
  ChevronRight,
  Search,
  CheckCircle2,
} from "lucide-react";
import renewAccessToken from "@/lib/token/renewAccessToken";
const ITEMS_PER_PAGE = 3;
const ViewPerformance = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "View Performance", href: "/view-performance" },
  ];

  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPerformanceData = useCallback(async (page) => {
    setLoading(true);
    let token = await renewAccessToken();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/view-performance/?page=${page}&limit=${ITEMS_PER_PAGE}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch performance data");

      const data = await res.json();
      if (data.success) {
        setPerformanceData(data.results);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformanceData(currentPage);
  }, [fetchPerformanceData, currentPage]);

  const calculateCorrectAnswers = useCallback(
    (answers) => answers.filter((answer) => answer.isCorrect).length,
    []
  );

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const filteredData = searchTerm
    ? performanceData.filter((perf) =>
        perf.examName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : performanceData;

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Performance Overview
              </h1>
              <p className="text-gray-600 mt-1">
                Track your exam results and progress
              </p>
            </div>

            <div className="mt-4 md:mt-0 relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Performance Cards */}
          <div className="mt-8">
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredData.map((performance) => {
                  const correctAnswers = calculateCorrectAnswers(
                    performance.answers
                  );
                  const percentage =
                    (correctAnswers / performance.answers.length) * 100;

                  return (
                    <div
                      key={performance._id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {performance.examName}
                            </h3>
                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {moment
                                  .duration(performance.timeTaken, "seconds")
                                  .format("h[h] m[m] s[s]")}
                              </span>
                              <span className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                {correctAnswers} / {performance.answers.length}{" "}
                                correct
                              </span>
                              <span
                                className={`flex items-center font-medium ${getPerformanceColor(
                                  percentage
                                )}`}
                              >
                                <Trophy className="h-4 w-4 mr-1" />
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex items-center gap-4">
                            <Link
                              href={`/view-performance/${performance.examName}`}
                              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                            >
                              View Result
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-4 text-gray-500 text-lg">
                  No performance data available.
                </p>
                <p className="text-gray-400">
                  Take some exams to see your results here!
                </p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-4 py-2 rounded ${
                currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300"
                  : "bg-blue-500 text-white"
              }`}
            >
              Next
            </button>
          </div>

          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default withAuth(ViewPerformance);
