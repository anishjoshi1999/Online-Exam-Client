import renewAccessToken from "../token/renewAccessToken";
const saveProgress = async (questionIndex, option, examData) => {
    const resultDetails = examData.questions
    .map((question, index) => {
      if (index == questionIndex) {
        const userAnswer = option;
        const isCorrect =
          userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase();
        return {
          question: question.question,
          userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          // explanation: question.explanation,
          // options: question.options,
        };
      } else {
        return null;
      }
    })
    .filter((detail) => detail !== null);
  if (resultDetails.length === 0) return; // If no details, skip the request

  try {
    const token = await renewAccessToken();
    const res = await fetch("/api/save-progress", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token here
      },
      body: JSON.stringify({
        examName: examData.slug, // Add examName here
        answers: resultDetails,
      }),
    });

    if (!res.ok) {
      const errorMessage = `Error ${res.status}: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    if (!data.success) {
      const message = data.message || "Failed to save exam progress.";
      throw new Error(message);
    }
  } catch (err) {
    console.error("Error during progress save:", err);
  }
};

export default saveProgress;
