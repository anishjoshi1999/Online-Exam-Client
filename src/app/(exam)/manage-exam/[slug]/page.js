"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withAuth from "@/components/Auth/withAuth";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import Loader from "@/components/Common/Loader";
import Navbar from "@/components/Navbar/Navbar";
import ExamForm from "@/components/Common/ExamForm";
import renewAccessToken from "@/lib/token/renewAccessToken";

function Page({ params }) {
  const { slug } = use(params);
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Exam", href: "/manage-exam" },
    { label: `Edit Exam`, href: `/manage-exam/${slug}` },
  ];

  const [exam, setExam] = useState({
    examName: "",
    startDate: "",
    endDate: "",
    totalMarks: "",
    passMarks: "",
    timezone: "",
    questions: [],
    showResult: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };
  const router = useRouter();

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        let token = await renewAccessToken();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/mcq/${slug}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch exam details: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        const { exam } = result;

        setExam({
          examName: exam.examName,
          startDate: moment(exam.startDate).format("YYYY-MM-DDTHH:mm"),
          endDate: moment(exam.endDate).format("YYYY-MM-DDTHH:mm"),
          totalMarks: exam.totalMarks,
          passMarks: exam.passMarks,
          questions: exam.questions,
          timezone: exam.timezone,
          showResult: exam.showResult,
        });
      } catch (err) {
        console.error("Error fetching exam details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [slug]);

  const handleExamDetailsChange = (e) => {
    const { name, value } = e.target;
    setExam((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[index][field] = value;
    setExam((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleAddQuestion = () => {
    setExam((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          weight: "",
          explanation: "",
        },
      ],
    }));
  };
  const handleQuestionOptionChange = (questionIndex, optionIndex, value) => {
    const updatedOptions = [...exam.questions[questionIndex].options];
    updatedOptions[optionIndex].optionText = value;
    handleQuestionChange(questionIndex, "options", updatedOptions);
  };
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = exam.questions.filter((_, i) => i !== index);
    setExam((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = async () => {
    const totalQuestionMarks = exam.questions.reduce(
      (acc, question) => acc + Number(question.weight),
      0
    );

    if (totalQuestionMarks !== Number(exam.totalMarks)) {
      toast.error(
        `The total marks of the questions (${totalQuestionMarks}) do not match the total marks of the exam (${exam.totalMarks}). Please adjust the question weights.`
      );
      return;
    }

    try {
      let token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mcq/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(exam),
        }
      );

      if (!response.ok) {
        toast.error(`Failed to update exam: ${response.status} ${response.statusText}`);
        return;
      }

      toast.success("Exam updated successfully!");
      // add some time delay to show the success toast
      setTimeout(() => {
        router.push("/manage-exam");
      }, 500);
    } catch (error) {
      toast.error(`Error updating exam: ${error.message}`);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16 ">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <div>
            {/* Exam Form Section */}
            <ExamForm
              examDetails={exam}
              questions={exam.questions}
              onExamDetailsChange={handleExamDetailsChange}
              onQuestionChange={handleQuestionChange}
              onAddQuestion={handleAddQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onSubmit={handleSubmit}
              isPreviewOpen={isPreviewOpen}
              handlePreview={handlePreview}
              handleClosePreview={handleClosePreview}
              submitButtonText="Update Exam"
              handleQuestionOptionChange={handleQuestionOptionChange}
            />
          </div>
          <ToastContainer position="top-right" autoClose={5000} />
        </div>
      </div>
    </>
  );
}

export default withAuth(Page);
