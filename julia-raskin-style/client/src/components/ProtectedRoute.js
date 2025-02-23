// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user } = useContext(AuthContext);

  // ✅ Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Check if admin-only route and user is not an admin
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
