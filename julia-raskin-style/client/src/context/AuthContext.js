// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup, logout as authLogout } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ✅ Login Function
  const handleLogin = async (userData) => {
    const data = await login(userData);
    setUser(data);
    navigate(data.isAdmin ? "/admin" : "/user/dashboard");
  };

  // ✅ Signup Function
  const handleSignup = async (userData) => {
    const data = await signup(userData);
    setUser(data);
    navigate("/user/dashboard");
  };

  // ✅ Logout Function - Consistent Naming
  const handleLogout = () => {
    authLogout();
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogin, handleSignup, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
