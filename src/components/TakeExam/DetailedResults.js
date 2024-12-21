import React from "react";
import processText from "@/lib/textUtilities/processText";
const DetailedResults = ({ results, answers }) => {
  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="question-container flex items-center space-x-2">
            <h3
              className="text-lg font-medium text-gray-900"
              dangerouslySetInnerHTML={{
                __html: `${index + 1}.`,
              }}
            ></h3>
            <p
              className="text-gray-900"
              dangerouslySetInnerHTML={{
                __html: processText(result.question),
              }}
            ></p>
          </div>
          <div className="space-y-3 mb-4">
            {result.options.map((option, i) => {
              const optionLetter = String.fromCharCode(97 + i);
              const isCorrect =
                result.correctAnswer.toLowerCase() === optionLetter;
              const isSelected = answers[index] === optionLetter;
              const bgColor = isCorrect
                ? "bg-green-50 border-green-200"
                : isSelected && !result.isCorrect
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200";

              return (
                <div key={i} className={`p-3 rounded-lg border ${bgColor}`}>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={optionLetter}
                      checked={answers[index] === optionLetter}
                      disabled
                      className="w-4 h-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2 text-black">{optionLetter}.</span>{" "}
                    {/* Adds a margin to the letter */}
                    <span
                      className="ml-3 text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: processText(option),
                      }}
                    ></span>
                  </label>
                </div>
              );
            })}
          </div>

          {/* Answer Analysis */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Your Answer:</span>
              <span
                className={result.isCorrect ? "text-green-600" : "text-red-600"}
              >
                {result.userAnswer !== undefined ? (
                  <>
                    {result.userAnswer} {result.isCorrect ? "✓" : "✗"}
                  </>
                ) : (
                  "No Answer ✗"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Correct Answer:</span>
              <span className="text-green-600 font-medium">
                {result.correctAnswer.toLowerCase()}
              </span>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mt-3">
              <span className="font-medium text-black">Explanation: </span>
              <p
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: processText(result.explanation),
                }}
              ></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailedResults;
