import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import RouteList from "./RouteList"; // Import your route definitions
import { AuthProvider } from "./context/AuthContext"; // Wrap app with AuthContext
import EditNote from "./Components/Notes/EditNote"; // Import your EditNote component

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Persist dark mode
  });

  // Create a theme instance
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  // Sync dark mode setting to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          {/* Global UI (Navbar, etc.) */}
          <RouteList toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

          {/* Routes for different pages */}
          <Routes>
            <Route path="/edit/:id" element={<EditNote />} />
          </Routes>
        </Router>
        
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
