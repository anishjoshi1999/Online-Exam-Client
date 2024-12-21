import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import renewAccessToken from "../token/renewAccessToken";
const submitExam = async (examData, answers, timeTaken, timer, setExamData, setIsExamStarted, setScore,violences) => {
  clearInterval(timer); // Clear the timer when submitting

  let totalScore = 0;
  const resultDetails = examData.questions.map((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase();
    if (isCorrect) {
      totalScore += question.weight || 1;
    }
    return {
      question: question.question,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation,
      options: question.options,
    };
  });

  // Set the score and exam results
  setScore(totalScore);
  setExamData(prevData => ({
    ...prevData,
    results: resultDetails,
  }));
  setIsExamStarted(false);

  // Send the results to the server
  try {
let token = await renewAccessToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/take-exam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        examName: examData.slug,
        answers: resultDetails,
        timeTaken,
        violences
      }),
    });

    if (!res.ok) {
      const errorMessage = `Error ${res.status}: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    if (!data.success) {
      const message = data.message || "Failed to submit exam results.";
      throw new Error(message);
    }

    toast.success("Exam results submitted successfully!"); // Show success toast
  } catch (err) {
    console.error("Error during exam submission:", err);
    toast.error(err.message || "You cannot submit more than once"); // Show error toast
  }
};

export default submitExam;
