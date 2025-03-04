import axiosInstance from "../axiosInstance";

// ✅ User Login
export const login = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData);
    const { token, user } = response.data;

    if (!user || !user.role) {
      throw new Error("User role not found.");
    }

    // ✅ Store User & Token in Local Storage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return user; // ✅ Return full user object
  } catch (error) {
    console.error("❌ Login Failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Login failed" };
  }
};

// ✅ User Logout
export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout");
    
    // ✅ Remove User & Token from Storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];

    return true;
  } catch (error) {
    console.error("❌ Logout Failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Logout failed" };
  }
};
