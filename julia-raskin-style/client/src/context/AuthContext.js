import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  // ✅ Fetch User Data on App Load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data)); // ✅ Sync local storage
      } catch (err) {
        console.error("⚠️ Failed to fetch user data:", err);
        handleLogout();
      }
    };

    if (!user) {
      fetchUser();
    }
  }, []);

  // ✅ Logout User
  const handleLogout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");

      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];

      navigate("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook for Authentication
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
