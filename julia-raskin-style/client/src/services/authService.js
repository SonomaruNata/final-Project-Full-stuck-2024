import axiosInstance from "../axiosInstance";

// ✅ Signup Function
export const signup = async (userData) => {
  return await axiosInstance.post("/auth/signup", userData);
};

// ✅ Login Function
export const login = async (userData) => {
  const response = await axiosInstance.post("/auth/login", userData);
  const { token, isAdmin } = response.data;

  localStorage.setItem("user", JSON.stringify({ email: userData.email, isAdmin }));
  localStorage.setItem("token", token);

  return response.data;
};

// ✅ Logout Function
export const logout = async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
