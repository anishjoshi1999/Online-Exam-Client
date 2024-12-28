"use client";

import React, { useEffect, useState, use } from "react";
import { Loader, AlertCircle } from "lucide-react";
import renewAccessToken from "@/lib/token/renewAccessToken";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Page({ params }) {
  const { subjectName } = use(params);
  let BREADCRUMB_ITEMS = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "View Resources", href: "/view-resources" },
    { label: "View Notes", href: "/view-resources/view-notes" },
    { label: `${subjectName}`, href: `/view-resources/view-notes/${subjectName}` },
  ];
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotesBySubject = async () => {
      try {
        const token = await renewAccessToken();
        // Make the GET request with the subjectName as a parameter
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-resources/get-one-subject-notes?subjectName=${subjectName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notes for this subject");
        }

        const data = await response.json();
        setNotes(data.resources || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotesBySubject();
  }, [subjectName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg text-gray-600">Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-xl text-gray-800 font-semibold">{error}</p>
        <button
          onClick={() => setLoading(true)}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={BREADCRUMB_ITEMS} />
          </div>
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Notes for <span className="text-blue-600">{subjectName}</span>
          </h2>

          {notes.length > 0 ? (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
                >
                  <Link
                    href={note.resourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-blue-600 hover:underline"
                  >
                    {note.title}
                  </Link>
                  <p className="mt-2 text-gray-600">{note.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-600 mt-8">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-4 text-xl">
                No notes available for this subject.
              </p>
            </div>
          )}
        </div>
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
}

export default Page;
