"use client";
import React,{useState,useEffect} from "react";
import withAuth from "@/components/Auth/withAuth";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import Navbar from "@/components/Navbar/Navbar";
import ExamForm from "@/components/Common/ExamForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useExamDetails } from "@/hooks/useExamDetails";
import { useQuestions } from "@/hooks/useQuestions";
import { useSubmitExam } from "@/hooks/useSubmitExam";

const CreateExamPage = () => {
  const [loading, setLoading] = useState(true); // Loader state
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Create Exam", href: "/create-exam" },
  ];
  const { examDetails, handleExamDetailsChange, resetExamDetails } =
    useExamDetails();
  const {
    questions,
    isPreviewOpen,
    handleQuestionChange,
    handleAddQuestion,
    handleDeleteQuestion,
    handlePreview,
    handleClosePreview,
    resetQuestions,
  } = useQuestions(examDetails);

  const { handleSubmit } = useSubmitExam(resetExamDetails, resetQuestions);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <ExamForm
            examDetails={examDetails}
            questions={questions}
            onExamDetailsChange={handleExamDetailsChange}
            onQuestionChange={handleQuestionChange}
            onAddQuestion={handleAddQuestion}
            onSubmit={() => handleSubmit(examDetails, questions)}
            isPreviewOpen={isPreviewOpen}
            handlePreview={handlePreview}
            onDeleteQuestion={handleDeleteQuestion}
            handleClosePreview={handleClosePreview}
          />
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
};

export default withAuth(CreateExamPage);
