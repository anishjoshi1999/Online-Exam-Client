import { jwtDecode } from 'jwt-decode';

const isAccessTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true; // Treat invalid tokens as expired
  }
};

export default isAccessTokenExpired;
