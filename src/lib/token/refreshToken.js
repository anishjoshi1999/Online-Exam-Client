import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const refreshToken = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include", // Required for httpOnly cookies
      }
    );

    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await res.json();
    localStorage.setItem("token", data.accessToken); // Update access token
  } catch (error) {
    console.log(error);
    console.log("Error refreshing token:", error);
    toast.error("Session expired, please log in again.");
  }
};
export default refreshToken;
