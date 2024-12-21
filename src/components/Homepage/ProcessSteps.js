import React from "react";
import { ProcessStep } from "./ProcessStep";
function ProcessSteps() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
        Simple Process
      </h2>
      <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto text-lg">
        Get started in minutes with our intuitive platform
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <ProcessStep
          number="1"
          title="Create Your Exam"
          description="Design professional exams with our AI-powered tools and templates"
        />
        <ProcessStep
          number="2"
          title="Share & Monitor"
          description="Distribute secure access links and monitor exams in real-time"
        />
        <ProcessStep
          number="3"
          title="Analyze Results"
          description="Get instant results and detailed performance analytics"
        />
      </div>
    </section>
  );
}

export default ProcessSteps;
