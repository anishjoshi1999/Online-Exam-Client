import isAccessTokenExpired from "./isAccessTokenExpired";
import refreshToken from "./refreshToken";

const renewAccessToken = async () => {
  try {
    let token = localStorage.getItem("token");
    if (!token) return;
    if (isAccessTokenExpired(token)) {
      console.log("Token Expired");
      await refreshToken();
      token = localStorage.getItem("token");
      console.log("New Access Token Updated");
    }
    return token;
  } catch (error) {
    console.error("Error during token refresh:", error);
    return null;
  }
};
export default renewAccessToken;
