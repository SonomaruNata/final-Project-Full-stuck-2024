// src/services/authService.js
import axiosInstance from "../axiosInstance";

// ✅ Signup Function
export const signup = async (userData) => {
  const response = await axiosInstance.post("/auth/signup", userData);
  return response.data;
};

// ✅ Login Function
export const login = async (userData) => {
  const response = await axiosInstance.post("/auth/login", userData);
  const { token, isAdmin, ...userDetails } = response.data;

  // ✅ Store isAdmin flag in localStorage
  localStorage.setItem("user", JSON.stringify({ ...userDetails, isAdmin }));
  localStorage.setItem("token", token);

  return { ...userDetails, isAdmin }; // ✅ Return isAdmin flag
};

// ✅ Logout Function
export const logout = async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
