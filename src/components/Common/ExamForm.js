"use client";
import React, { useState } from "react";
import {
  Plus,
  Trash2,
  FileText,
  Calendar,
  CheckSquare,
  Globe,
  HelpCircle,
} from "lucide-react";
import timezones from "@/lib/timeZoneUtilities/TimeZones";
import moment from "moment-timezone";
import Preview from "./Preview";
import WYSIWYGEditor from "../WYSIWYG/WYSIWYGEditor";
import WYSIWYGOptionEditor from "../WYSIWYG/WYSIWYGOptionEditor";
import WYSIWYGExplainationEditor from "../WYSIWYG/WYSIWYGExplainationEditor";
import InputField from "./InputField";
import Loader from "./Loader";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
const ExamForm = ({
  examDetails,
  questions,
  onExamDetailsChange,
  onQuestionChange,
  onAddQuestion,
  onDeleteQuestion,
  onSubmit,
  isPreviewOpen,
  handlePreview,
  handleClosePreview,
  submitButtonText = "Create Exam",
}) => {
  const handleQuestionOptionChange = (questionIndex, optionIndex, value) => {
    const updatedOptions = [...questions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    onQuestionChange(questionIndex, "options", updatedOptions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push(""); // Add an empty string for the new option
    onQuestionChange(
      questionIndex,
      "options",
      updatedQuestions[questionIndex].options
    );
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedOptions = [...questions[questionIndex].options];
    updatedOptions.splice(optionIndex, 1); // Remove the selected option
    onQuestionChange(questionIndex, "options", updatedOptions);
  };

  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const promptText = `Generate a multiple-choice question with the following requirements in KaTeX without rendering, and write the question in a .txt file:

  1. The question should be related to the subject (e.g., Physics).
  2. Include inline math using $ ... $ delimiters for variables, constants, and short expressions.
  3. Include display math using $$ ... $$ delimiters for equations or formulas that should be centered on their own line.
  4. Provide four options (A, B, C, D), with one correct answer.
  5. Include a step-by-step explanation of the solution, using both inline and display math as needed.
  .
  `;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    alert("Prompt copied to clipboard!");
  };

  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Kathmandu"); // Default timezone
  const togglePopup = () => setShowPopup(!showPopup);

  // Function to convert local time to UTC and a specific timezone
  const getTimeConversions = (dateTime, targetZone, date) => {
    if (!dateTime) return "";
    const localTime = moment(dateTime);
    const utcTime = localTime.clone().utc().format("YYYY-MM-DD HH:mm:ss [UTC]");
    const targetTime = localTime
      .clone()
      .tz(targetZone)
      .format("YYYY-MM-DD HH:mm:ss [z]");

    return `
    ${date}
    <br>
      Local: ${localTime.format("YYYY-MM-DD HH:mm")}<br>
      UTC: ${utcTime}<br>
      ${targetZone}: ${targetTime}
    `;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">
            {submitButtonText === "Create Exam"
              ? "Create New Exam"
              : "Update Exam"}
          </h2>
          <p className="text-gray-600 mt-2">
            {submitButtonText === "Create Exam"
              ? "Fill in the exam details and add questions"
              : "Modify the exam details and questions"}
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Exam Details Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Exam Details
            </h3>
            <div className="space-y-6">
              <InputField
                label="Exam Name"
                icon={FileText}
                name="examName"
                value={examDetails.examName}
                onChange={onExamDetailsChange}
                placeholder="Enter exam name"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <InputField
                  label="Start Date & Time (Local Time)"
                  icon={Calendar}
                  type="datetime-local"
                  name="startDate"
                  value={examDetails.startDate}
                  onChange={onExamDetailsChange}
                />
                <div
                  className="absolute top-0 right-0 flex items-center space-x-2 cursor-pointer"
                  onClick={togglePopup}
                >
                  <Globe className="w-5 h-5 text-gray-500" />
                </div>

                <InputField
                  label="End Date & Time (Local Time)"
                  icon={Calendar}
                  type="datetime-local"
                  name="endDate"
                  value={examDetails.endDate}
                  onChange={onExamDetailsChange}
                />
              </div>

              {/* Timezone Dropdown */}
              <div className="mt-4">
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Target Time Zone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={examDetails.timezone}
                  onChange={onExamDetailsChange}
                  className="mt-2 w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-black"
                >
                  {timezones.map((timezone) => (
                    <option key={timezone} value={timezone}>
                      {timezone}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Total Marks"
                  icon={CheckSquare}
                  type="number"
                  name="totalMarks"
                  value={examDetails.totalMarks}
                  onChange={onExamDetailsChange}
                  placeholder="Enter total marks"
                />
                <InputField
                  label="Pass Marks"
                  icon={CheckSquare}
                  type="number"
                  name="passMarks"
                  value={examDetails.passMarks}
                  onChange={onExamDetailsChange}
                  placeholder="Enter pass marks"
                />
                {/* Show Result CheckBox */}

                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <label
                      htmlFor="showResult"
                      className="text-gray-700 font-medium"
                    >
                      Show Result Immediately After Submission
                    </label>
                    <input
                      id="showResult"
                      type="checkbox"
                      name="showResult"
                      checked={examDetails.showResult}
                      onChange={(e) =>
                        onExamDetailsChange({
                          target: {
                            name: e.target.name,
                            value: e.target.checked,
                          },
                        })
                      }
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Questions
                </h3>
                <div className="flex gap-4">
                  <Button
                    onClick={onAddQuestion}
                    className="inline-flex items-center bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Question
                  </Button>
                  <Button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center bg-yellow-600 hover:bg-yellow-700"
                  >
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Learn How to Add Equations
                  </Button>
                </div>
              </div>

              {/* shadcn/ui Dialog (Modal) */}
              <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add Equations</DialogTitle>
                    <DialogDescription>
                      Copy and paste the following prompt into ChatGPT,
                      DeepSeek, or any LLM chat website to generate equations
                      and questions.
                    </DialogDescription>
                  </DialogHeader>
                  <pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-sm">
                    {promptText}
                  </pre>
                  <DialogHeader>
                    <DialogTitle>Note</DialogTitle>
                    <DialogDescription>
                      {`From the generated response, try copying and pasting the
                      equation into the text editor. Remember, for the equation
                      to render in the WYSIWYG editor, ensure there is no space
                      between the $ symbols and the equation. For example, use
                      $2x + 5 = 15$ instead of $ 2x + 5 = 15 $.`}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-4">
                    <Button
                      onClick={handleCopyPrompt}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Copy Prompt
                    </Button>
                    <Button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-500 hover:bg-gray-600"
                    >
                      Close
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {questions.map((question, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl shadow-md p-6 space-y-4"
              >
                <WYSIWYGEditor
                  index={index}
                  question={question}
                  onQuestionChange={onQuestionChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {question.options.map((option, i) => (
                    <div key={i} className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">
                          {String.fromCharCode(65 + i)}
                        </span>
                      </div>
                      <WYSIWYGOptionEditor
                        questionIndex={index}
                        index={i}
                        option={question.options[i]}
                        handleQuestionOptionChange={handleQuestionOptionChange}
                      />
                      {/* <input
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        value={question.options[i]}
                        onChange={(e) =>
                          handleQuestionOptionChange(index, i, e.target.value)
                        }
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      /> */}
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index, i)}
                          className="absolute right-0 top-0 px-2 py-1 bg-red-500 text-white rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddOption(index)}
                    className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Option
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-black"
                    value={question.correctAnswer.toUpperCase() || ""} // Use a fallback to prevent uncontrolled input
                    onChange={(e) =>
                      onQuestionChange(index, "correctAnswer", e.target.value)
                    }
                  >
                    <option value="">Select Correct Answer</option>
                    {question.options.map((option, i) => (
                      <option key={i} value={String.fromCharCode(65 + i)}>
                        {String.fromCharCode(65 + i)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-black"
                    value={question.weight}
                    onChange={(e) =>
                      onQuestionChange(index, "weight", e.target.value)
                    }
                    placeholder="Question weight"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"></div>
                  <WYSIWYGExplainationEditor
                    index={index}
                    question={question}
                    onQuestionChange={onQuestionChange}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={onAddQuestion}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Question
                  </button>
                  <button
                    onClick={() => onDeleteQuestion(index)}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-x-4 flex justify-center">
            <button
              type="button"
              onClick={handlePreview} // This is the preview button click handler
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Preview
            </button>
            <button
              onClick={onSubmit}
              className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              {submitButtonText}
            </button>
          </div>
        </div>
      </div>
      {/* Show preview if preview is open */}
      {isPreviewOpen && (
        <Preview
          examDetails={examDetails}
          questions={questions}
          handleClosePreview={handleClosePreview}
        />
      )}
      {/* Time Conversion Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg w-1/2 max-w-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-800">
                Time Conversions
              </h3>
              <button
                onClick={togglePopup}
                className="text-gray-600 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <div className="mt-4 text-gray-800">
              <p
                dangerouslySetInnerHTML={{
                  __html: getTimeConversions(
                    examDetails.startDate,
                    selectedTimezone,
                    "Start Date"
                  ),
                }}
              />
            </div>
            <div className="mt-4 text-gray-800">
              <p
                dangerouslySetInnerHTML={{
                  __html: getTimeConversions(
                    examDetails.endDate,
                    selectedTimezone,
                    "End Date"
                  ),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamForm;
