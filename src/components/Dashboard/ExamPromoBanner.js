"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react"; // Lucide React icons
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // shadcn/ui components
import { Button } from "@/components/ui/button"; // shadcn/ui button

// Example implementation of trackEvent
const trackEvent = (action, category, label) => {
  console.log(`Event: ${action}, Category: ${category}, Label: ${label}`);
  // Add your analytics tracking logic here (e.g., Google Analytics, Mixpanel, etc.)
};

export default function ExamPromoBanner({ isAdmin }) {
  const handleLearnMoreClick = () => {
    trackEvent("click", "NonAdmin_Engagement", "Learn_More");
  };

  if (isAdmin) return null; // Do not render if user is admin

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Interested in Conducting Online MCQ Exams?
        </CardTitle>
        <CardDescription className="text-gray-600">
          Create and manage professional online MCQ exams effortlessly. Enhance
          the experience for students with a sleek and user-friendly interface.
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-5">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="default"
            className="px-6 py-3 font-semibold transition-all hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link
              href="/learn-more"
              onClick={handleLearnMoreClick}
              aria-label="Learn more about online MCQ exams"
            >
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>

      {/* Decorative icon */}
      <CardFooter className="absolute right-6 bottom-6 text-blue-200">
        <BookOpen className="h-16 w-16" />
      </CardFooter>
    </Card>
  );
}