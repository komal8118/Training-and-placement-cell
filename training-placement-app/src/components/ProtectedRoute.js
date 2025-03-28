import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(AuthContext);

  // Show loading state while user authentication is being checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    console.warn("Unauthorized access - Redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  // If user role is not allowed, redirect to unauthorized page
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.warn("Access denied - Insufficient permissions");
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
