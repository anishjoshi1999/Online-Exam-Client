"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";

function GetStarted() {
  return (
    <div className="min-h-screen bg-gray-50">
        {/* <Navbar /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Get Started with Online MCQ Exams
          </h1>
          <p className="text-gray-600 mb-4">
            Begin your journey to effortless exam management today. Follow
            these simple steps to set up and conduct professional online MCQ
            exams.
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-4">
            <li>Create an account or log in to the platform.</li>
            <li>Navigate to the "Design Your Exam" section.</li>
            <li>Set up your exam with questions, timing, and settings.</li>
            <li>Share the exam link with participants.</li>
            <li>Monitor progress and review results instantly.</li>
          </ol>
          
          {/* Early Access Notice */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Still in Early Phase</h2>
            <p className="text-gray-600">
              We are still in the early phase and haven’t made our platform public yet.
              To get early access and be the first to experience our features, please join the waiting list.
            </p>
            <p className="text-gray-600 mt-2">
              We will try to provide you access as soon as possible, if you provide valid credentials.
            </p>
            <Link
              href="/waiting-list"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Join the Waiting List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
