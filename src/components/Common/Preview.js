import React from "react";
import {
  X,
  Clock,
  Calendar,
  Award,
  CheckCircle,
  Book,
  HelpCircle,
} from "lucide-react";
import moment from "moment";
import processText from "@/lib/textUtilities/processText";

function Preview({
  examDetails,
  questions,
  handleClosePreview,
  submitButtonText,
}) {
  // Helper function to check if an option is correct
  const isCorrectOption = (index, correctAnswer) => {
    const optionLetter = String.fromCharCode(97 + index); // Convert 0 to 'a', 1 to 'b', etc.
    return optionLetter === correctAnswer.toLowerCase();
  };

  return (
    <div className="fixed inset-0 bg-gray-800/75 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {examDetails.examName}
              </h2>
              <p className="text-gray-500 mt-1">Preview Mode</p>
            </div>
            <button
              onClick={handleClosePreview}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Exam Details Card */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Book className="w-5 h-5 text-blue-600" />
              Exam Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Start Date
                  </p>
                  <p className="text-gray-900">
                    {moment(examDetails.startDate).format(
                      "MMM DD, YYYY - hh:mm A"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p className="text-gray-900">
                    {moment(examDetails.endDate).format(
                      "MMM DD, YYYY - hh:mm A"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Marks
                  </p>
                  <p className="text-gray-900">
                    {examDetails.totalMarks} points
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Pass Marks
                  </p>
                  <p className="text-gray-900">
                    {examDetails.passMarks} points
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Questions ({questions.length})
            </h3>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-gray-600 font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="question-container">
                        <h3
                          className="font-semibold text-gray-800"
                          dangerouslySetInnerHTML={{
                            __html: processText(question.question),
                          }}
                        ></h3>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {question.weight} points
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mb-4 text-black">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg ${
                          isCorrectOption(optIndex, question.correctAnswer)
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isCorrectOption(
                            optIndex,
                            question.correctAnswer
                          ) && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          <span>
                            {String.fromCharCode(97 + optIndex).toUpperCase()}.
                          </span>
                          <span
                            className={`text-sm ${
                              isCorrectOption(optIndex, question.correctAnswer)
                                ? "text-green-800"
                                : "text-gray-800"
                            }`}
                            dangerouslySetInnerHTML={{
                              __html:
                                submitButtonText === "Update Exam"
                                  ? processText(option.optionText)
                                  : processText(option),
                            }}
                          ></span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-orange-800 mb-1">
                        Explanation
                      </p>
                      <p
                        className="text-sm text-orange-800"
                        dangerouslySetInnerHTML={{
                          __html: processText(question.explanation),
                        }}
                      ></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
