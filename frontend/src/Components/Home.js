 import React, { useState, useEffect } from "react";
import { Typography, Button, CircularProgress } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { deleteNote, searchNotes, getNotes } from "../api";
import SearchBar from "./Notes/SearchBar";
import NoteList from "./Notes/NoteList";
import UserProfile from './UserProfile'; // Import UserProfile

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [expandedNoteIds, setExpandedNoteIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const checkTokenExpiration = (token) => {
    if (!token) return false;
    const decodedToken = jwtDecode(token);
    return decodedToken.exp > Date.now() / 1000;
  };

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token || !checkTokenExpiration(token)) {
      alert("Your session has expired. Please log in again.");
      navigate("/login");
      return;
    }
  
    try {
      const data = await getNotes(); // Use the getNotes function from api.js
      setNotes(data);
      setFilteredNotes(data);
    } catch (error) {
      console.error("Error loading notes:", error);
      setError("There was an issue loading your notes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const fetchSearchResults = async () => {
        try {
          const searchResults = await searchNotes(searchTerm);
          setFilteredNotes(searchResults);
        } catch (err) {
          setError(err.message || "Failed to search for notes.");
        }
      };

      fetchSearchResults();
    }
  }, [searchTerm, notes]);

  const handleDelete = async (noteId) => {
    try {
      const response = await deleteNote(noteId);
      if (response && response.success) {
        setSuccessMessage(response.message);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        setFilteredNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        setError("");
      } else {
        setError("Failed to delete note. Please try again.");
      }

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("There was an issue deleting your note.");
    }
  };

  const handleToggleContent = (noteId) => {
    setExpandedNoteIds((prevState) =>
      prevState.includes(noteId)
        ? prevState.filter((id) => id !== noteId)
        : [...prevState, noteId]
    );
  };

  if (isLoading) return <div><CircularProgress /></div>;

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ marginBottom: "20px" }}>
        My Notes
      </Typography>

      {/* Render UserProfile at the top */}
      <UserProfile /> {/* Display the user profile component */}

      {/* Ensure SearchBar is only rendered once */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {successMessage && (
        <Typography color="success" style={{ marginBottom: "20px" }}>
          {successMessage}
        </Typography>
      )}

      {error && <Typography color="error">{error}</Typography>}

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/add-note")}
        style={{ marginBottom: "20px" }}
      >
        Add New Note
      </Button>

      <NoteList
        notes={filteredNotes}
        expandedNoteIds={expandedNoteIds}
        handleToggleContent={handleToggleContent}
        handleDelete={handleDelete}
        navigate={navigate}
      />
    </div>
  );
};

export default Home;