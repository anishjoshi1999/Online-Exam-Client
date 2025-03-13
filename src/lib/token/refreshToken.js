import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const refreshToken = async () => {
  try {
    let token = localStorage.getItem("token");
    if (token != null) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include", // Required for httpOnly cookies
        }
      );

      if (!res.ok) {
        toast.error(`Failed to refresh token: ${res.status} ${res.statusText}`);
      }

      const data = await res.json().catch(() => null);
      if (data?.accessToken) {
        localStorage.setItem("token", data.accessToken);
      } else {
        toast.error("Invalid token response");
      }
    }
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    toast.error("Session expired, please log in again.");
  }
};

export default refreshToken;
