"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, Loader, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import renewAccessToken from "@/lib/token/renewAccessToken";

const BREADCRUMB_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "View Resources", href: "/view-resources" },
  { label: "View Notes", href: "/view-resources/view-notes" },
];

const ViewNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("subjectName");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-resources/get-all-notes`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data.result);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError(error.message);
      toast.error("Failed to load notes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotes = notes
    .filter((note) =>
      note.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const modifier = sortOrder === "asc" ? 1 : -1;
      return modifier * a[sortBy].localeCompare(b[sortBy]);
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleRetry = () => {
    fetchNotes();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={BREADCRUMB_ITEMS} />
          </div>

          <div className="mt-8 lg:mt-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-3xl font-bold text-gray-900">
                View Notes
                <span className="ml-2 text-lg text-gray-500">
                  ({filteredNotes.length} {filteredNotes.length === 1 ? 'subject' : 'subjects'})
                </span>
              </h2>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow duration-200"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center mt-16">
                <Loader className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="mt-4 text-gray-600">Loading notes...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center mt-16">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <p className="mt-4 text-gray-800 font-medium">{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-16">
                <BookOpen className="h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">
                  {searchTerm
                    ? "No subjects found matching your search"
                    : "No notes available"}
                </p>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note,index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                          {note.subjectName}
                        </h3>
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {note.count}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {note.count === 1 ? '1 note' : `${note.count} notes`}
                        </span>
                      </div>
              
                      <Link
                        className="mt-4 w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                       href={`/view-resources/view-notes/${note.subjectName}`}
                      >
                        View Details
                        <span className="text-gray-400">→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
};

export default ViewNotesPage;