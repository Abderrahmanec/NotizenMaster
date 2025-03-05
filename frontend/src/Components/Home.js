import React, { useState, useEffect } from "react";
import { Typography, CircularProgress, Box, Grid } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { deleteNote, getNotes } from "../api";
import NoteList from "./Notes/NoteList";
import UserProfile from './UserProfile';

const Home = ({ searchTerm = "" }) => { // Standardmäßig leerer String, falls nicht definiert
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [expandedNoteIds, setExpandedNoteIds] = useState([]);
  const navigate = useNavigate();

  // Überprüft, ob das Token noch gültig ist
  const checkTokenExpiration = (token) => {
    if (!token) return false;
    const decodedToken = jwtDecode(token);
    return decodedToken.exp > Date.now() / 1000;
  };

  // Holt Notizen vom Server
  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token || !checkTokenExpiration(token)) {
      alert("Du bist abgemeldet.");
      navigate("/login");
      return;
    }

    try {
      const data = await getNotes();
      setNotes(data);
      setFilteredNotes(data); // Standardmäßig alle Notizen anzeigen
    } catch (error) {
      console.error("Fehler beim Laden der Notizen:", error);
      setError("Es gab ein Problem beim Laden deiner Notizen.");
    } finally {
      setIsLoading(false);
    }
  };

  // Lädt Notizen beim ersten Rendern der Komponente
  useEffect(() => {
    fetchNotes();
  }, []);

  // Filtert die Notizen basierend auf dem Suchbegriff
  useEffect(() => {


  if (!Array.isArray(notes)) {
    return;
  }

    if (searchTerm.trim() === "") {
      setFilteredNotes(notes); // Falls Suchbegriff leer ist, alle Notizen anzeigen
    } else {
      const filtered = notes.filter((note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered); // Gefilterte Notizen aktualisieren
    }
  }, [searchTerm, notes]);

  // Löscht eine Notiz
  const handleDelete = async (noteId) => {
    try {
      const response = await deleteNote(noteId);
      if (response && response.success) {
        setSuccessMessage(response.message);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        setFilteredNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        setError("");
      } else {
        setError("Löschen der Notiz fehlgeschlagen. Bitte versuche es erneut.");
      }

      // Erfolgsnachricht nach 3 Sekunden entfernen
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Fehler beim Löschen der Notiz:", error);
      setError("Es gab ein Problem beim Löschen deiner Notiz.");
    }
  };

  // Erweitert oder reduziert den Inhalt einer Notiz
  const handleToggleContent = (noteId) => {
    setExpandedNoteIds((prevState) =>
        prevState.includes(noteId)
            ? prevState.filter((id) => id !== noteId)
            : [...prevState, noteId]
    );
  };

  if (isLoading) return <div><CircularProgress /></div>;

  return (
      <Box sx={{ padding: { xs: "10px", sm: "20px", md: "40px" } }}>

        {/* Benutzerprofil am oberen Rand anzeigen */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          <UserProfile />
        </Box>

        {/* Erfolg- und Fehlermeldungen anzeigen */}
        {successMessage && <Typography color="success" sx={{ marginBottom: "20px" }}>{successMessage}</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {/* Notizenliste anzeigen */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={9}>
            <NoteList
                notes={filteredNotes}  // Gefilterte Notizen an NoteList übergeben
                expandedNoteIds={expandedNoteIds}
                handleToggleContent={handleToggleContent}
                handleDelete={handleDelete}
                navigate={navigate}
            />
          </Grid>
        </Grid>
      </Box>
  );
};

export default Home;
