import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to check token validity
  const isTokenValid = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        console.warn("Token has expired.");
        return false;
      }
      return decodedToken;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  // Check for token in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const validToken = token ? isTokenValid(token) : null;
    setUser(validToken || null);

    // Listen for token changes in other tabs
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setUser(newToken ? isTokenValid(newToken) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const validToken = isTokenValid(token);
    setUser(validToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
