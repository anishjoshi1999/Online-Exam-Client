"use client";
import { useState } from "react";
import { toast } from "react-toastify";

export const useQuestions = (examDetails) => {
  const [questions, setQuestions] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    if (
      !examDetails.totalMarks ||
      !examDetails.passMarks ||
      !examDetails.startDate ||
      !examDetails.endDate ||
      !examDetails.examName
    ) {
      toast.error("Please fill in all the fields before adding questions.");
      return;
    }
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        weight: "",
        explanation: "",
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  // Added resetQuestions function to clear questions
  const resetQuestions = () => {
    setQuestions([]);
  };

  return {
    questions,
    isPreviewOpen,
    handleQuestionChange,
    handleAddQuestion,
    handleDeleteQuestion,
    handlePreview,
    handleClosePreview,
    resetQuestions, // Exposed resetQuestions function
  };
};
