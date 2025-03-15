import React from "react";
import { QuickStep } from "@/components/Homepage/Steps/QuickStep";
import { HowToUseSteps } from "@/components/Homepage/Steps/data";
import Navbar from "@/components/Navbar/Navbar";

function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Getting Started with Our Exam System
              </h1>
              <p className="text-gray-600 mt-2">
                Follow these simple steps to create and manage exams
                effortlessly.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <div className="flex flex-wrap justify-center gap-8 text-center">
          {HowToUseSteps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-xl font-bold">
                {step.number}
              </div>
              <h3 className="font-semibold mt-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>

              {/* Add arrows between steps except for the last one */}
              {index < HowToUseSteps.length - 1 && (
                <div className="absolute left-1/2 top-full transform -translate-x-1/2 mt-2">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Page;
