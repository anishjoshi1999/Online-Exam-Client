import isAccessTokenExpired from "./isAccessTokenExpired";
import refreshToken from "./refreshToken";

const renewAccessToken = async () => {
  try {
    let token = localStorage.getItem("token");

    if (!token || isAccessTokenExpired(token)) {
      await refreshToken();
      token = localStorage.getItem("token"); // Re-fetch updated token
    }

    return token || null;
  } catch (error) {
    console.error("Error during token renewal:", error);
    return null;
  }
};

export default renewAccessToken;
