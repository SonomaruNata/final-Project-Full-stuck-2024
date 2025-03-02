// src/services/authService.js
import axiosInstance from "../axiosInstance";

// ✅ Signup Function
export const signup = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/signup", userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

// ✅ Login Function
export const login = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData, { withCredentials: true });
    const { token, isAdmin, ...userDetails } = response.data;

    // ✅ Store isAdmin flag & Token
    localStorage.setItem("user", JSON.stringify({ ...userDetails, isAdmin }));
    localStorage.setItem("token", token);

    // ✅ Set default Authorization Header for all requests
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return { ...userDetails, isAdmin }; // ✅ Return user details with isAdmin flag
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// ✅ Logout Function
export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout", {}, { withCredentials: true }); // ✅ Notify server
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // ✅ Remove default Authorization header
    delete axiosInstance.defaults.headers.common["Authorization"];
  } catch (error) {
    throw error.response?.data || { message: "Logout failed" };
  }
};
