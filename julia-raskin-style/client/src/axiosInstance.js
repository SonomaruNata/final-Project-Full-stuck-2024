import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/", // ✅ Ensure API base URL is correct
  headers: {
    "Content-Type": "application/json",
  },
});

/** 
 * ✅ Login User API Call
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} API response
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data?.message || error.message);
    throw error;
  }
};

export default axiosInstance;
