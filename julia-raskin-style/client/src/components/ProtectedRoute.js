import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsAuthChecked(true);
    }
  }, [loading]);

  // ✅ Show loading state until auth check is complete
  if (!isAuthChecked) {
    return <div>Loading...</div>; // Replace with a proper loader/spinner
  }

  // ✅ Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ Redirect if trying to access an admin-only route without admin privileges
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
