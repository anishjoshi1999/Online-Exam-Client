"use client";
import { toast } from "react-toastify";
import renewAccessToken from "@/lib/token/renewAccessToken";
export const useSubmitExam = (resetExamDetails, resetQuestions) => {
  const handleSubmit = async (examDetails, questions) => {
    // Convert options format in the frontend before submission
    const formattedQuestions = questions.map((question) => ({
      ...question,
      options: question.options.map((option, index) => ({
        option: String.fromCharCode(97 + index), // 'a', 'b', 'c', etc.
        optionText: option,
      })),
    }));

    // Validate total question marks
    const totalQuestionMarks = formattedQuestions.reduce(
      (acc, question) => acc + Number(question.weight),
      0
    );

    if (totalQuestionMarks !== Number(examDetails.totalMarks)) {
      toast.error(
        `The total marks of the questions (${totalQuestionMarks}) do not match the total marks of the exam (${examDetails.totalMarks}). Please adjust the question weights.`
      );
      return;
    }

    try {
      let token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mcq`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ examDetails, questions: formattedQuestions }),
        }
      );

      if (!response.ok)
        throw new Error(`Failed to create exam: ${response.status}`);

      await response.json();
      toast.success("Exam created successfully!");
      resetExamDetails();
      resetQuestions();
    } catch (error) {
      toast.error(`Error creating exam: ${error.message}`);
    }
  };

  return { handleSubmit };
};
