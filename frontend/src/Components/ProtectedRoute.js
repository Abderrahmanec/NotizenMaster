import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Komponente für geschützte Routen, die sicherstellt, dass der Benutzer eingeloggt ist
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  // Wenn der Benutzer nicht eingeloggt ist, wird er zur Login-Seite weitergeleitet
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wenn der Benutzer eingeloggt ist, wird der Inhalt der geschützten Route angezeigt
  return children;
};

export default ProtectedRoute;
