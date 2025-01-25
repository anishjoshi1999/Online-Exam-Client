"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; // shadcn/ui components
import { Button } from "@/components/ui/button"; // shadcn/ui button
import { LayoutDashboard, CheckCircle, BarChart } from "lucide-react"; // Lucide React icons

function LearnMore() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Header Section */}
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Why Conduct Online MCQ Exams?
            </CardTitle>
            <CardDescription className="text-gray-600 mb-4">
              Online MCQ exams provide a seamless and efficient way to evaluate
              knowledge and skills. Enjoy the flexibility of conducting exams
              anywhere with features like automated grading, real-time analytics,
              and a user-friendly interface.
            </CardDescription>
            <CardDescription className="text-gray-600 mb-4">
              Our platform offers robust tools to design, manage, and analyze
              exams, ensuring an exceptional experience for both examiners and
              participants.
            </CardDescription>
          </CardHeader>

          {/* Early Access Notice */}
          <Card className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Still in Early Phase
              </CardTitle>
              <CardDescription className="text-gray-600">
                We are still in the early phase and haven’t made our platform public yet.
                To get early access and be the first to experience our features, please join the waiting list!
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/waiting-list">Join the Waiting List</Link>
              </Button>
            </CardFooter>
          </Card>
        </Card>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: User-Friendly Interface */}
          <Card className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <CardHeader>
              <LayoutDashboard className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
                User-Friendly Interface
              </CardTitle>
              <CardDescription className="text-gray-600">
                Our platform is designed with simplicity and ease of use in mind.
                No technical expertise is required to get started.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 2: Automated Grading */}
          <Card className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
                Automated Grading
              </CardTitle>
              <CardDescription className="text-gray-600">
                Save time with automated grading and instant result generation,
                ensuring accuracy and efficiency.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 3: Real-Time Analytics */}
          <Card className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <CardHeader>
              <BarChart className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
                Real-Time Analytics
              </CardTitle>
              <CardDescription className="text-gray-600">
                Track exam performance in real time with detailed analytics and
                reports.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LearnMore;