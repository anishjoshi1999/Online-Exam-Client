"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BookOpen,
  PenTool,
  BarChart3,
  Users,
  Calendar,
  CheckCircle,
  Bell,
  PlusCircle,
  X,
} from "lucide-react";
import jwt from "jsonwebtoken";
import StatsCard from "@/components/Dashboard/StatsCard";
import ActionCard from "@/components/Dashboard/ActionCard";
import Navbar from "@/components/Navbar/Navbar";
import Loader from "@/components/Common/Loader";
import withAuth from "@/components/Auth/withAuth";
import renewAccessToken from "@/lib/token/renewAccessToken";
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

  const NotificationPanel = () => (
    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 w-96 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <button
          onClick={() => setShowNotification(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notificationLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-800">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No new notifications</p>
            <p className="text-sm text-gray-400 mt-1">
              We'll notify you when something arrives
            </p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <Link
          href="#"
          className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );

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
                >
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {showNotification && <NotificationPanel />}
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
            Enhance the experience for students with a sleek and user-friendly interface.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Exams"
            value="24"
            change={12}
            icon={BookOpen}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
            iconClassName="text-blue-600"
          />
          <StatsCard
            title="Active Students"
            value="156"
            change={-8}
            icon={Users}
            className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
            iconClassName="text-green-600"
          />
          <StatsCard
            title="Completion Rate"
            value="87%"
            change={5}
            icon={CheckCircle}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
            iconClassName="text-purple-600"
          />
          <StatsCard
            title="Upcoming Exams"
            value="8"
            change={0}
            icon={Calendar}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
            iconClassName="text-orange-600"
          />
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
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
