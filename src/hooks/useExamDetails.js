"use client";
import { useState } from "react";

export const useExamDetails = () => {
  const [examDetails, setExamDetails] = useState({
    examName: "",
    startDate: "",
    endDate: "",
    totalMarks: "",
    passMarks: "",
    timezone: "Asia/Kathmandu" // Set a default timezone
  });

  const handleExamDetailsChange = (e) => {
    const { name, value } = e.target;
    setExamDetails((prev) => ({ ...prev, [name]: value }));
  };

  const resetExamDetails = () => {
    setExamDetails({
      examName: "",
      startDate: "",
      endDate: "",
      totalMarks: "",
      passMarks: "",
      timezone: "Asia/Kathmandu" // Set a default timezone
    });
  };

  return { examDetails, handleExamDetailsChange, resetExamDetails };
};
