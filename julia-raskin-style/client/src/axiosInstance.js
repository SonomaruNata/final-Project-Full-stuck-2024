import axios from "axios";

// ✅ Create Axios Instance with Base URL and Credentials
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Consistent API base URL
  withCredentials: true, // ✅ Include cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add Interceptor to Attach Token to Every Request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

/** 
 * ✅ Logout User API Call
 */
export const logoutUser = async () => {
  try {
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem("token");
  } catch (error) {
    console.error("❌ Logout Error:", error.response?.data?.message || error.message);
  }
};

// ✅ Export Default Instance for Other API Calls
export default axiosInstance;
