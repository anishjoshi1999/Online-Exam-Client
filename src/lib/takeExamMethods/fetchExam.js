import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import renewAccessToken from "../token/renewAccessToken";
const fetchExamData = async (
  slug,
  setExamData,
  setAnswers,
  setTimeLeft,
  setLoading,
  setError
) => {
  setLoading(true); // Set loading to true
  setError(null); // Reset error

  try {
    
    let token = await renewAccessToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/take-exam/${slug}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const errorMessage = `Error ${res.status}: ${res.statusText}`;
      if (res.status === 423) {
        toast.error("You have already taken the exam");
      } else if (res.status == 401 || res.status == 404) {
        toast.error("You don't have access to this exam");
      }
      throw new Error(errorMessage);
    }

    const data = await res.json();

    if (!data.success) {
      const message = data.message || "Failed to fetch exam data";
      toast.error(message);
      throw new Error(message);
    }

    const now = moment();
    const examEndDate = moment(data.exam.endDate);

    // Set exam data and time left
    setExamData(data.exam);

    if (data.result) {
      const existingAnswers = data.result.answers.reduce(
        (acc, { userAnswer }, index) => {
          acc[index] = userAnswer; // Populate existing answers
          return acc;
        },
        {}
      );
      setAnswers(existingAnswers);
    }

    const durationInSeconds = examEndDate.diff(now, "seconds");
    setTimeLeft(durationInSeconds); // Set the time left
  } catch (err) {
    // console.error("Error during exam fetch:", err);
    setError(err.message); // Set error message
  } finally {
    setLoading(false); // Reset loading state
  }
};

export default fetchExamData;
