"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  PenTool,
  BarChart3,
  Users,
  Calendar,
  CheckCircle,
  Bell,
  Gift,
  GraduationCap,
  PlusCircle,
  Edit3,
  FileText,
  Video,
  MessageSquare,
  ClipboardCheck,
  Upload,
} from "lucide-react";
import jwt from "jsonwebtoken";
import StatsCard from "@/components/Dashboard/StatsCard";
import ActionCard from "@/components/Dashboard/ActionCard";
import ActivityItem from "@/components/Dashboard/ActivityItem";
import Navbar from "@/components/Navbar/Navbar";
import Loader from "@/components/Common/Loader";
import withAuth from "@/components/Auth/withAuth";

function Dashboard() {
  const [userName, setUserName] = useState("User");
  const [isAdmin, setAdmin] = useState("user");
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true); // Loader state
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token);
        if (decoded.userRole == "admin") {
          setAdmin("admin");
        }
        setUserName(decoded.firstName || "User"); // Update this field based on your token structure
        setLoading(false);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  if (loading) {
    // Show loader while loading
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Navbar Section */}
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome Back, {userName} 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Track your exam management system and stay updated
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotification(!showNotification)}
                className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors duration-200"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link href="/create-exam">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow group">
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                  Create New Exam
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Exams"
            value="24"
            change={12}
            icon={BookOpen}
          />
          <StatsCard
            title="Active Students"
            value="156"
            change={-8}
            icon={Users}
          />
          <StatsCard
            title="Completion Rate"
            value="87%"
            change={5}
            icon={CheckCircle}
          />
          <StatsCard
            title="Upcoming Exams"
            value="8"
            change={0}
            icon={Calendar}
          />
        </div>
        {/* Main Actions Grid */}

        {/* Study Materials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-4 mb-6">
            <div className="flex items-center gap-3">
              <Edit3 className="text-green-600" size={27} />
              <h2 className="text-2xl font-bold text-black">Study Materials</h2>
            </div>
          </div>
          {isAdmin === "admin" && (
            <>
              <ActionCard
                icon={Upload}
                title="Upload Resources"
                description="Upload study notes and lectures for all topics"
                href="/upload-resources"
              />
            </>
          )}

          <ActionCard
            icon={Upload}
            title="View Resources"
            description="Access study notes and lectures for all topics"
            href="/view-resources"
          />
          {/* <ActionCard
            icon={FileText}
            title="View Notes"
            description="Access and download study notes for all topics"
            href="#"
          />
          <ActionCard
            icon={Video}
            title="Recorded Lectures"
            description="Watch and learn from recorded video sessions"
            href="#"
          />
          <ActionCard
            icon={MessageSquare}
            title="Discussion Forums"
            description="Join discussions and collaborate with peers"
            href="#"
          />
          <ActionCard
            icon={ClipboardCheck}
            title="Mock Tests"
            description="Practice and evaluate your knowledge with mock tests"
            href="#"
          /> */}
        </div>
        {/* Online Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-4 flex items-center gap-3">
            <GraduationCap className="text-blue-600" size={32} />
            <h2 className="text-2xl font-bold text-black">Live Online Exam</h2>
          </div>
          {isAdmin === "admin" && (
            <>
              <ActionCard
                icon={PlusCircle}
                title="Design Your Exam"
                description="Design and set up new exams with ease"
                href="/create-exam"
              />
              <ActionCard
                icon={BookOpen}
                title="Organize & Manage"
                description="Get Exam codes, manage exams, and track performances"
                href="/manage-exam"
              />
            </>
          )}
          <ActionCard
            icon={PenTool}
            title="Start the Exam"
            description="Begin your scheduled exam session via Exam Code"
            href="/take-exam"
          />
          <ActionCard
            icon={BarChart3}
            title="Analyze Results"
            description="Track and analyze exam results and ranking"
            href="/view-performance"
          />
          {/* <ActionCard
            icon={Book}
            title="Resources & Materials"
            description="Access study materials and helpful resources for preparation."
            href="#"
          />
          <ActionCard
            icon={HelpCircle}
            title="FAQs"
            description="Find answers to commonly asked questions about the exam process."
            href="#"
          /> */}
        </div>

        {/* Mock MCQ Exams Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-4 mb-6">
            <div className="flex items-center gap-3">
              <Edit3 className="text-blue-600" size={27} />
              <h2 className="text-2xl font-bold text-black">
                Mock MCQ Exams (Coming Soon)
              </h2>
            </div>
          </div>
          <ActionCard
            icon={PlusCircle}
            title="Create Mock Exam"
            description="Design and set up new mock exams"
            href="#"
            disabled="true"
          />
          <ActionCard
            icon={BookOpen}
            title="Manage Mocks"
            description="View, edit, and manage existing mock exams"
            href="#"
            disabled="true"
          />
          <ActionCard
            icon={PenTool}
            title="Take Mock Exam"
            description="Begin your scheduled mock exam session"
            href="#"
            disabled="true"
          />
          <ActionCard
            icon={BarChart3}
            title="Mock Performance"
            description="Track and analyze mock exam results and ranking"
            href="#"
            disabled="true"
          />
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Recent Activity
                </h2>
                <Link
                  href="/all-activity"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-2">
                <ActivityItem
                  title="Mathematics Final Exam Created"
                  time="2 hours ago"
                  type="exam"
                  href="/exam/1"
                />
                <ActivityItem
                  title="New Student Submissions"
                  time="4 hours ago"
                  type="alert"
                  href="/submissions"
                />
                <ActivityItem
                  title="Physics Quiz Completed"
                  time="6 hours ago"
                  type="success"
                  href="/exam/2"
                />
              </div>
            </div>
          </div>

          {/* Quick Tips Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Quick Tips
                </h2>
                <Gift className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-4">
                {[
                  "Receive an email for the live mock test",
                  "Click on the link in the email to start the exam",
                  "Submit the exam to receive results along with marks",
                  "View your rank after submission",
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200" />
                    <p className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
