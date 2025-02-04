import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Container, CircularProgress, Typography } from "@mui/material";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Logout from "./Components/Logout";
import AddNote from "./Components/AddNote";
import DisplayNotes from "./Components/DisplayNotes";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import { AuthProvider, useAuth } from "./AuthContext";

// ProtectedRoute component to restrict access to authenticated users
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Persist dark mode
  });

  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Fetch notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        // Redirect to login page if token is missing
        window.location.href = "/login";
        return;
      }
  
      try {
        const response = await fetch("http://localhost:8080/notes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const fetchedNotes = await response.json();
          setNotes(fetchedNotes);
        } else {
          setError("Failed to fetch notes");
        }
      } catch (error) {
        setError("Error fetching notes");
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchNotes();
  }, []);
   // Empty dependency array ensures it runs once when the component mounts

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleAddNote = (note) => {
    if (!note.trim()) return; // Prevent adding empty notes

    // Call backend to add the note
    const addNote = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8080/notes", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: note.title, description: note.description, tags: note.tags }),
        });

        if (response.ok) {
          const newNote = await response.json();
          setNotes((prevNotes) => [...prevNotes, newNote]);
        } else {
          console.error("Failed to add note");
        }
      } catch (error) {
        console.error("Error adding note:", error);
      }
    };

    addNote();
  };

  const handleDeleteNote = async (index) => {
    const noteToDelete = notes[index];

    // Call backend to delete the note
    try {
      const response = await fetch(`http://localhost:8080/notes/${noteToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index)); // Efficiently filter out the deleted note
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEditNote = (note, index) => {
    setEditNote({ ...note, index });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          <Routes>
            <Route
              path="/"
              element={
                <Home notes={notes} onDeleteNote={handleDeleteNote} onEditNote={handleEditNote} />
              }
            />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Container>
                    <AddNote onAddNote={handleAddNote} editNote={editNote} />
                    <DisplayNotes
                      notes={notes}
                      onDeleteNote={handleDeleteNote}
                      onEditNote={handleEditNote}
                    />
                  </Container>
                </ProtectedRoute>
              }
            />
            <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
