"use client";

import React, { useEffect, useState, use } from "react";
import { Loader, AlertCircle, BookOpen } from "lucide-react";
import renewAccessToken from "@/lib/token/renewAccessToken";
import Navbar from "@/components/Navbar/Navbar";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";

function Page({ params }) {
  const { subjectName } = use(params);
  const BREADCRUMB_ITEMS = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "View Resources", href: "/view-resources" },
    { label: "View Lectures", href: "/view-resources/view-lectures" },
    { label: `${subjectName}`, href: `/view-resources/view-lectures/${subjectName}` },
  ];

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    const fetchNotesBySubject = async () => {
      try {
        const token = await renewAccessToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-resources/get-one-subject-lectures?subjectName=${subjectName}`,
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
        // Set the first lecture as selected by default
        if (data.resources && data.resources.length > 0) {
          setSelectedLecture(data.resources[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotesBySubject();
  }, [subjectName]);

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg text-gray-600">Loading Lectures...</p>
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
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={BREADCRUMB_ITEMS} />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Lectures for <span className="text-blue-600">{subjectName}</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lecture List - Right Side */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 h-[calc(100vh-240px)] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Lecture List</h3>
              {notes.length > 0 ? (
                <ul className="space-y-3">
                  {notes.map((note) => (
                    <li
                      key={note._id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedLecture?._id === note._id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedLecture(note)}
                    >
                      <div className="flex items-start space-x-3">
                        <BookOpen className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">{note.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {note.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-600 mt-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-4 text-xl">No lectures available.</p>
                </div>
              )}
            </div>

            {/* Video Player - Left Side */}
            <div className="lg:col-span-3">
              {selectedLecture ? (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <VideoPlayer 
                    videoId={getYouTubeVideoId(selectedLecture.resourceLink)} 
                  />
                  <div className="mt-4">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {selectedLecture.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {selectedLecture.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-lg shadow-md">
                  <AlertCircle className="h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-xl text-gray-600">
                    Select a lecture to start learning
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