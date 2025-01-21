"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BookOpen,
  PenTool,
  BarChart3,
  Clock,
  CheckCircle,
  Bell,
  PlusCircle,
  Gift,
  Shield,
  Wifi,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import jwt from "jsonwebtoken";
import ActivityItem from "@/components/Dashboard/ActivityItem";
import ActionCard from "@/components/Dashboard/ActionCard";
import Navbar from "@/components/Navbar/Navbar";
import Loader from "@/components/Common/Loader";
import withAuth from "@/components/Auth/withAuth";
import renewAccessToken from "@/lib/token/renewAccessToken";
import NotificationPanel from "@/components/Common/NotificationPanel";
// Function to track events using Google Analytics
function trackEvent(action, category, label) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
    });
  }
}
function Dashboard() {
  const [userName, setUserName] = useState("User");
  const [isAdmin, setAdmin] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationLoading, setNotificationLoading] = useState(false);
  // Track Learn More button click
  const handleLearnMoreClick = () => {
    trackEvent("click", "NonAdmin_Engagement", "Learn_More");
  };

  // Track Get Started button click
  const handleGetStartedClick = () => {
    trackEvent("click", "NonAdmin_Engagement", "Get_Started");
  };
  useEffect(() => {
    const fetchData = async () => {
      const token = await renewAccessToken();
      if (token) {
        try {
          const decoded = jwt.decode(token);
          setAdmin(decoded.userRole === "admin");
          setUserName(decoded.firstName || "User");
          setLoading(false);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    fetchData();
  }, []);

  const fetchNotifications = async () => {
    setNotificationLoading(true);
    try {
      let token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data || []);
      } else {
        toast.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
    if (!showNotification) {
      fetchNotifications();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome Back, {userName} 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Track your exam management system and stay updated
              </p>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="p-2 rounded-lg hover:bg-gray-100 relative transition-all duration-200"
                  aria-label="Toggle notifications"
                >
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {showNotification && (
                  <NotificationPanel
                    notifications={notifications}
                    loading={notificationLoading}
                    onClose={() => setShowNotification(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {!isAdmin && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Interested in Conducting Online MCQ Exams?
            </h2>
            <p className="text-gray-600 mb-4">
              Create and manage professional online MCQ exams effortlessly.
              Enhance the experience for students with a sleek and user-friendly
              interface.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/learn-more"
                onClick={handleLearnMoreClick}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Learn More
              </Link>
              <Link
                href="get-started"
                onClick={handleGetStartedClick}
                className="px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* System Status Card */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">System Check</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Camera Access Enabled
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Microphone Connected
                </div>
                <Link
                  href="#"
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-700 mt-2"
                >
                  Run Full Check <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </Card>

          {/* Browser Compatibility */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Browser Status</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Chrome 121.0.6167.85</p>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Latest Version Detected
                </div>
                <Link
                  href="#"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  View Requirements <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </Card>

          {/* Connection Status */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Wifi className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Network Check</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Strong Connection
                </div>
                <p className="text-sm text-gray-600">Latency: 45ms</p>
                <Link
                  href="#"
                  className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 mt-2"
                >
                  Test Connection <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </Card>

          {/* Time Status */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Time Zone</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Current: Asia/Kolkata</p>
                <p className="text-sm text-gray-600">
                  Local Time: {new Date().toLocaleTimeString()}
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 mt-2"
                >
                  Verify Settings <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isAdmin && (
            <>
              <ActionCard
                icon={PlusCircle}
                title="Design Your Exam"
                description="Design and set up new exams with ease"
                href="/create-exam"
                className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200"
                iconClassName="text-blue-600"
              />
              <ActionCard
                icon={BookOpen}
                title="Organize & Manage"
                description="Manage exams and track performances"
                href="/manage-exam"
                className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200"
                iconClassName="text-green-600"
              />
            </>
          )}
          <ActionCard
            icon={PenTool}
            title="Start Test"
            description="Begin your scheduled exam session"
            href="/take-exam"
            className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200"
            iconClassName="text-purple-600"
          />
          <ActionCard
            icon={BarChart3}
            title="Analyze Results"
            description="Track and analyze exam results"
            href="/view-performance"
            className="bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200"
            iconClassName="text-orange-600"
          />
        </div>

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
