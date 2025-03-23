import axios from "axios";


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensure cookies are sent
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("🚨 Unauthorized! Logging out user...");
      await logout();
      window.location.href = "/login"; // Redirect user to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
