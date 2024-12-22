import React from "react";
import { QuickStep } from "./QuickStep";
import { DetailedStep } from "./DetailedStep";
import { quickSteps, detailedSteps } from "./data";
import Link from "next/link";

const ProcessSteps = () => {
  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      aria-labelledby="process-title"
    >
      <header className="text-center mb-16">
        <h1
          id="process-title"
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          How StartTest.online Works
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get started in minutes with our intuitive platform
        </p>
      </header>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24"
        aria-label="Quick overview of the process"
      >
        {quickSteps.map((step) => (
          <QuickStep key={step.number} {...step} />
        ))}
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Detailed Guide to StartTest.online
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Follow our comprehensive guide to create and manage your online
          assessments
        </p>
      </div>

      <div className="space-y-16">
        {detailedSteps.map((step, index) => (
          <DetailedStep key={step.title} {...step} index={index} />
        ))}
      </div>

      <footer className="text-center mt-24 space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Ready to Transform Your Assessment Process?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join thousands of educators who trust StartTest.online for reliable
          and efficient online assessments.
        </p>

        <button
          className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Get started with StartTest.online"
        >
          <Link href="/register">Get Started Today</Link>
        </button>
      </footer>
    </section>
  );
};

export default ProcessSteps;
