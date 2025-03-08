"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BookOpen,
  PenTool,
  BarChart3,
  Clock,
  Bell,
  PlusCircle,
  Lightbulb,
  Target,
  RefreshCw,
  Monitor,
  ClipboardList,
  Mail,
  Key,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jwt from "jsonwebtoken";
import ActionCard from "@/components/Dashboard/ActionCard";
import Navbar from "@/components/Navbar/Navbar";
import Loader from "@/components/Common/Loader";
import withAuth from "@/components/Auth/withAuth";
import renewAccessToken from "@/lib/token/renewAccessToken";
import NotificationPanel from "@/components/Common/NotificationPanel";
import SystemStatusCheck from "@/components/StatusCard/SystemStatusCheck";
import ConnectionStatusCheck from "@/components/StatusCard/ConnectionStatusCheck";
import TimeStatusCheck from "@/components/StatusCard/TimeStatusCheck";
import BrowserCompatibilityCheck from "@/components/StatusCard/BrowserCompatibilityCheck";

function Dashboard() {
  const [userName, setUserName] = useState("User");
  const [isAdmin, setAdmin] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationLoading, setNotificationLoading] = useState(false);

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
        {/* <Navbar /> */}
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

        <div className="space-y-10">
          {/* Online MCQ Exam Section */}
          <div>
            <div className="flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Online MCQ Exam
              </h1>
            </div>
            <p className="text-gray-600 mt-2">
              Create, manage, and analyze MCQ exams with ease.
            </p>
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
                <ActionCard
                  icon={Key}
                  title="Provide Access"
                  description="Provide Access to students for exams"
                  href="provide-access"
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
              description="Analyze exam results for improvement"
              href="/view-performance"
              className="bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200"
              iconClassName="text-orange-600"
            />
          </div>

          {/* System Diagnostics Section */}
          <div>
            <div className="flex items-center gap-3">
              {/* Lucide Icon */}
              <Monitor className="w-8 h-8 text-blue-600" />
              {/* Heading */}
              <h1 className="text-3xl font-bold text-gray-900">
                System Diagnostics
              </h1>
            </div>
            {/* Subheading */}
            <p className="text-gray-600 mt-2">
              Monitor and optimize your computer’s performance with real-time
              status updates.
            </p>
          </div>

          {/* Grid Layout for Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* System Status Card */}
            <SystemStatusCheck />

            {/* Browser Compatibility Card */}
            <BrowserCompatibilityCheck />

            {/* Connection Status Card */}
            <ConnectionStatusCheck />

            {/* Time Status Card */}
            <TimeStatusCheck />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Motivational Quotes Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Today's Inspiration
                  </CardTitle>
                  {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refreshQuotes()}
                >
                  <RefreshCw className="w-4 h-4 mr-2 text-blue-600" />
                  Refresh
                </Button> */}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4 flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-gray-800 italic">
                      {`"Education is the passport to the future, for tomorrow belongs to those who prepare for it today." – Malcolm X`}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="p-4 flex items-start space-x-3">
                    <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-gray-800 italic">
                      {`"The roots of education are bitter, but the fruit is sweet." – Aristotle`}
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Tips for Academic Success Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Tips for Success
                  </CardTitle>
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-gray-800">
                    Set clear, achievable goals for each study session to stay
                    focused and motivated.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-gray-800">
                    Create a study schedule and stick to it to manage your time
                    effectively.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-gray-800">
                    Review your notes regularly to reinforce learning and
                    improve retention.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-gray-800">
                    Practice past exams to familiarize yourself with the format
                    and identify areas for improvement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
