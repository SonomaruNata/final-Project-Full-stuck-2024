import axiosInstance from "../axiosInstance";

export const login = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData);
    const { token, user } = response.data;
    if (!user?.role) throw new Error("User role missing!");

    // Store user & token in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return user;
  } catch (error) {
    console.error("❌ Login Failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Login failed" };
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout");
    localStorage.clear();
    delete axiosInstance.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("❌ Logout Failed:", error.response?.data || error.message);
  }
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
