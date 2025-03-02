import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import processText from "@/lib/textUtilities/processText";

const ExamSections = ({ questions, answers, onOptionChange }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 1;

  // Calculate total pages
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // Log questions when the page changes
  useEffect(() => {}, [currentPage]);

  // Handle page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle direct question navigation from grid
  const handleQuestionNavigation = (questionIndex) => {
    setCurrentPage(questionIndex);
  };

  // Get questions for current page
  const getCurrentPageQuestions = () => {
    const startIndex = currentPage * questionsPerPage;
    return questions.slice(startIndex, startIndex + questionsPerPage);
  };

  // Render current page questions
  const renderCurrentPageQuestions = () => {
    const currentPageQuestions = getCurrentPageQuestions();

    return currentPageQuestions.map((question, pageIndex) => {
      const actualQuestionIndex = currentPage * questionsPerPage + pageIndex;

      return (
        <div
          key={actualQuestionIndex}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="question-container flex items-center space-x-2">
            <h3
              className="text-lg font-medium text-gray-900"
              dangerouslySetInnerHTML={{
                __html: `${actualQuestionIndex + 1}.`,
              }}
            ></h3>
            <p
              className="text-gray-900"
              dangerouslySetInnerHTML={{
                __html: processText(question.question),
              }}
            ></p>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {question.weight} points
            </span>
          </div>
          <div className="grid gap-3">
            {question.options.map((option, optionIndex) => {
              const optionLetter = String.fromCharCode(97 + optionIndex);
              return (
                <label
                  key={optionIndex}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors text-black"
                >
                  <input
                    type="radio"
                    name={`question-${actualQuestionIndex}`}
                    value={optionLetter}
                    checked={answers[actualQuestionIndex] === optionLetter}
                    onChange={() =>
                      onOptionChange(actualQuestionIndex, optionLetter)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2">{optionLetter}.</span>{" "}
                  {/* Adds a margin to the letter */}
                  <span
                    className="ml-3 text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: processText(option.optionText),
                    }}
                  ></span>
                </label>
              );
            })}
          </div>
        </div>
      );
    });
  };

  // Render question navigation grid
  const renderQuestionGrid = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleQuestionNavigation(index)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                currentPage === index
                  ? "bg-blue-600 text-white"
                  : answers[index]
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:opacity-80 transition-colors`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Question Navigation Grid */}
      <div className="mb-4">{renderQuestionGrid()}</div>

      {/* Questions for current page */}
      {renderCurrentPageQuestions()}

      {/* Pagination Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            currentPage === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="text-gray-600">
          Page {currentPage + 1} of {totalPages}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            currentPage === totalPages - 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ExamSections;
