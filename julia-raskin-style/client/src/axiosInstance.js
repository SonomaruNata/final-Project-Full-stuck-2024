import axios from "axios";

// ✅ Create Axios Instance with Base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Consistent API base URL
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
    // ✅ Consistent Endpoint Path
    const response = await axiosInstance.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Login failed, please try again.");
  }
};

// ✅ Export Default Instance for Other API Calls
export default axiosInstance;
