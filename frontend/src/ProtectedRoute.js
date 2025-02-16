import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; //  AuthContext

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Get the user state from AuthContext

  if (!user) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return children; // If the user is logged in, render the protected content
};

export default ProtectedRoute;
