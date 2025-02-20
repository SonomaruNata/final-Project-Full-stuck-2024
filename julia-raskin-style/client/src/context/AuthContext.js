import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

// ✅ Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Check Authentication Status on Mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axiosInstance.get("/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("❌ Error checking authentication:", error);
          localStorage.removeItem("token");
        }
      }
    };
    checkAuth();
  }, []);

  // ✅ Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
