"use client";
import React, { useEffect, useState, use } from "react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import withAuth from "@/components/Auth/withAuth";
import moment from "moment";
import Link from "next/link";
import "moment-duration-format";
import Navbar from "@/components/Navbar/Navbar";
import Loader from "@/components/Common/Loader";
import { Search, ArrowDownCircle } from "lucide-react";
import renewAccessToken from "@/lib/token/renewAccessToken";
function ViewParticipationPage({ params }) {
  const { slug } = use(params);
  const [participationData, setParticipationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Exam", href: "/manage-exam" },
    { label: `${slug}`, href: `/manage-exam/${slug}/view-participation` },
    {
      label: "View Participation",
      href: `/manage-exam/${slug}/view-participation`,
    },
  ];

  useEffect(() => {
    const fetchParticipation = async () => {
      try {
        let token = await renewAccessToken();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/view-participation/${slug}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setParticipationData(data.results);
        }
      } catch (error) {
        console.error("Error fetching participation data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipation();
  }, [slug]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedAndFilteredData = [...participationData]
    .filter((item) =>
      item.examTakenBy.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;

      let compareA, compareB;

      if (sortField === "examTakenBy") {
        compareA = a.examTakenBy.email.toLowerCase();
        compareB = b.examTakenBy.email.toLowerCase();
      } else if (sortField === "timeTaken") {
        compareA = a.timeTaken;
        compareB = b.timeTaken;
      } else if (sortField === "percentage") {
        const getPercentage = (result) => {
          const correct = result.answers.filter((a) => a.isCorrect).length;
          return (correct / result.answers.length) * 100;
        };
        compareA = getPercentage(a);
        compareB = getPercentage(b);
      }

      if (compareA < compareB) return sortDirection === "asc" ? -1 : 1;
      if (compareA > compareB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const exportToCSV = () => {
    // Add CSV headers
    const rows = [["Username", "Time Taken", "Score", "Percentage"]];

    sortedAndFilteredData.forEach((result) => {
      // Calculate scores
      const correctAnswers = result.answers.filter((a) => a.isCorrect).length;
      const totalQuestions = result.answers.length;
      const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

      // Format time taken using moment duration
      const formattedTime = moment
        .duration(result.timeTaken, "seconds")
        .format("h[h] m[m] s[s]");

      rows.push([
        result.examTakenBy.email,
        formattedTime,
        `="${correctAnswers}/${totalQuestions}"`, // Use Excel text formatting
        `${percentage}%`,
      ]);
    });

    // Convert to CSV string, properly handling commas and quotes
    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => {
            // If cell contains commas, quotes, or newlines, wrap in quotes
            if (
              cell.includes(",") ||
              cell.includes('"') ||
              cell.includes("\n")
            ) {
              return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
          })
          .join(",")
      )
      .join("\n");

    // Create and trigger download with BOM for Excel UTF-8 compatibility
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exam-results-${slug}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <>
        <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Exam Participation
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by email..."
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <button
                    onClick={exportToCSV}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <ArrowDownCircle className="w-5 h-5" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {sortedAndFilteredData.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("examTakenBy")}
                      >
                        Username
                        {sortField === "examTakenBy" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("timeTaken")}
                      >
                        Time Taken
                        {sortField === "timeTaken" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("percentage")}
                      >
                        Percentage
                        {sortField === "percentage" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedAndFilteredData.map((result, index) => {
                      const correctAnswers = result.answers.filter(
                        (answer) => answer.isCorrect
                      ).length;
                      const totalQuestions = result.answers.length;
                      const percentage = (
                        (correctAnswers / totalQuestions) *
                        100
                      ).toFixed(2);

                      return (
                        <tr
                          key={result._id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {result.examTakenBy.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {moment
                              .duration(result.timeTaken, "seconds")
                              .format("h[h] m[m] s[s]")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {correctAnswers} / {totalQuestions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-sm rounded-full ${
                                parseFloat(percentage) >= 70
                                  ? "bg-green-100 text-green-800"
                                  : parseFloat(percentage) >= 50
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {percentage}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/manage-exam/${slug}/view-participation/${result.examTakenBy._id}`}
                            >
                              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                                View Result
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    No participation data found for this exam.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(ViewParticipationPage);
