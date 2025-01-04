"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";

function LearnMore() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Why Conduct Online MCQ Exams?
          </h1>
          <p className="text-gray-600 mb-4">
            Online MCQ exams provide a seamless and efficient way to evaluate
            knowledge and skills. Enjoy the flexibility of conducting exams
            anywhere with features like automated grading, real-time analytics,
            and a user-friendly interface.
          </p>
          <p className="text-gray-600 mb-4">
            Our platform offers robust tools to design, manage, and analyze
            exams, ensuring an exceptional experience for both examiners and
            participants.
          </p>
          {/* Early Access Notice */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Still in Early Phase</h2>
            <p className="text-gray-600">
              We are still in the early phase and haven’t made our platform public yet.
              To get early access and be the first to experience our features, please join the waiting list!
            </p>
            <Link
              href="/waiting-list"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Join the Waiting List
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              User-Friendly Interface
            </h3>
            <p className="text-gray-600">
              Our platform is designed with simplicity and ease of use in mind.
              No technical expertise is required to get started.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Automated Grading
            </h3>
            <p className="text-gray-600">
              Save time with automated grading and instant result generation,
              ensuring accuracy and efficiency.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Real-Time Analytics
            </h3>
            <p className="text-gray-600">
              Track exam performance in real time with detailed analytics and
              reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnMore;
