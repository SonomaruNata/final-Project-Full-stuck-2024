import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("🛡️ Checking user access:", user);
  }, [user]);

  if (!user) {
    console.warn("🚨 User not logged in, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    console.warn("🚨 User is not admin, redirecting to home.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
