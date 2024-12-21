"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import withAuth from "@/components/Auth/withAuth";
import Loader from "@/components/Common/Loader";
import Navbar from "@/components/Navbar/Navbar";
import Preview from "@/components/Common/Preview";
import renewAccessToken from "@/lib/token/renewAccessToken";
import copy from "copy-to-clipboard";
import {
  PlusIcon,
  BookOpen,
  FileCheck,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CalendarCheck,
} from "lucide-react";
import Link from "next/link";
import ExamRow from "@/components/Common/ExamRow";

function ManageExamPage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Exam", href: "/manage-exam" },
  ];

  const [exams, setExams] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 3; // Define how many exams to show per page
  const [selectedExam, setSelectedExam] = useState(null);

  const handlePreview = (exam) => {
    setSelectedExam(exam);
  };

  const handleClosePreview = () => {
    setSelectedExam(null);
  };
  useEffect(() => {
    fetchExams();
  }, [currentPage]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      let token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mcq?page=${currentPage}&limit=${examsPerPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch exams");

      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        throw new Error("Error parsing response data");
      }

      setExams(data.exams);
      setStatistics(data.examStatistics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    const confirmed = confirm(
      "Are you sure you want to delete this exam? This will delete all information, including participation results, details, and rank."
    );
    if (!confirmed) return;

    try {
      let token = await renewAccessToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mcq/${slug}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete exam");

      setExams((prevExams) => prevExams.filter((exam) => exam.slug !== slug));
      // Re-fetch the updated list of exams
      fetchExams();
      toast.success("Exam deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCopySlug = (slug) => {
    copy(slug);
    toast.success("Exam Code copied to clipboard!");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const participationRate =
    exams.reduce((acc, exam) => acc + (exam.participation || 0), 0) /
    (statistics.total || 1);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                  Manage Exams
                </h1>
                <p className="text-gray-600 mt-1 ml-8">
                  Overview and management of all your exams
                </p>
              </div>
              <Link href="/create-exam">
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow group">
                  <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                  Create New Exam
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Exams */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Total Exams
                  </h3>
                  <p className="text-3xl font-bold mt-2 text-gray-900">
                    {statistics.total}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-600 gap-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                All created exams
              </div>
            </div>

            {/* Active Exams */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Active Exams
                  </h3>
                  <p className="text-3xl font-bold mt-2 text-emerald-600">
                    {statistics.activeExams}
                  </p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors duration-200">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-600 gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Currently running
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Upcoming Exams
                  </h3>
                  <p className="text-3xl font-bold mt-2 text-orange-500">
                    {statistics.upcomingExams}
                  </p>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-200">
                  <Calendar className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-600 gap-1">
                <CalendarCheck className="w-4 h-4 text-orange-500" />
                Scheduled for the future
              </div>
            </div>

            {/* Participation Rate */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    Participation Rate
                  </h3>
                  <p className="text-3xl font-bold mt-2 text-purple-600">
                    {(participationRate * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-200">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-600 gap-1">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Average participation
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam Code
                    </th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {exams.map((exam) => (
                    <ExamRow
                      key={exam.slug}
                      exam={exam}
                      onDelete={handleDelete}
                      onCopySlug={handleCopySlug}
                      onPreview={() => handlePreview(exam)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
            >
              Previous
            </button>
            <span className="text-gray-700">Page {currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={exams.length < examsPerPage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {selectedExam && (
        <Preview
          examDetails={selectedExam}
          questions={selectedExam.questions}
          handleClosePreview={handleClosePreview}
        />
      )}
      <ToastContainer />
    </>
  );
}

export default withAuth(ManageExamPage);
