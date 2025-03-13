import { jwtDecode } from "jwt-decode";

const isAccessTokenExpired = (token) => {
  if (!token) return true; // Treat empty or null tokens as expired

  try {
    const { exp } = jwtDecode(token);
    return !exp || Date.now() >= exp * 1000;
  } catch (error) {
    console.error("Invalid token:", error.message);
    return true; // Treat invalid tokens as expired
  }
};

export default isAccessTokenExpired;
