import { FeatureCard } from "./FeatureCard";
import {
  Sparkles,
  Shield,
  BarChart2,
  Clock,
  Target,
  CheckCircle2,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "Smart Exam Creation",
      description:
        "Create professional exams in minutes with AI-powered question generation, customizable templates, and multiple question types.",
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description:
        "Ensure exam integrity with AI proctoring, browser lockdown, and real-time monitoring to prevent cheating.",
    },
    {
      icon: BarChart2,
      title: "Detailed Analytics",
      description:
        "Get comprehensive insights into student performance with detailed reports, statistics, and performance trends.",
    },
    {
      icon: Clock,
      title: "Automated Time Management",
      description:
        "Set flexible time limits, schedule exams, and automate the entire examination process.",
    },
    {
      icon: Target,
      title: "Auto Evaluation",
      description:
        "Automatically grade objective questions and streamline subjective evaluation with our smart tools.",
    },
    {
      icon: CheckCircle2,
      title: "Seamless Exam Sync",
      description:
        "Automatically store answers if connectivity is lost, allowing access across all devices later.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
        Powerful Features
      </h2>
      <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
        Everything you need to manage your examination process efficiently
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="opacity-0 animate-slide-up"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: "forwards",
            }}
          >
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </section>
  );
}
