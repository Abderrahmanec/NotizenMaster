import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Skeleton,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { styled } from "@mui/system";

const NoteCard = styled(Card)(({ theme }) => ({
  margin: "15px",
  padding: "15px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  width: "300px",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const NoteChip = styled(Chip)(({ theme }) => ({
  margin: "4px",
  backgroundColor: "#f5f5f5",
  fontWeight: "bold",
}));

const DisplayNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    id: null,
    title: "",
    content: "",
    tags: [],
    images: [],
  });

  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/notes/get`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

  const handleOpenDialog = (note) => {
    setCurrentNote(note);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateNote = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/notes/edit/${currentNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentNote),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      fetchNotes();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating note:", error);
      setError(error.message);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/notes/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      fetchNotes();
      setError(null);
    } catch (error) {
      console.error("Error deleting note:", error);
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentNote({ ...currentNote, [name]: value });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" width="80%" height={150} sx={{ marginBottom: 2 }} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography color="error" variant="h6">{`Error: ${error}`}</Typography>
        <Button variant="contained" color="primary" onClick={fetchNotes}>
          Retry
        </Button>
      </Box>
    );
  }

  if (notes.length === 0) {
    return <Typography sx={{ textAlign: "center", marginTop: 4 }}>No notes available</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {notes.map((note) => (
        <NoteCard key={note.id}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              {note.title}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              {note.content}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {note.tags?.map((tag, index) => (
                <NoteChip key={index} label={tag} />
              ))}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: 1 }}>
              {note.images?.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt="Note"
                  style={{ width: "80px", height: "80px", margin: "4px", borderRadius: "4px" }}
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}>
              <IconButton onClick={() => handleOpenDialog(note)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDeleteNote(note.id)} color="error">
                <Delete />
              </IconButton>
            </Box>
          </CardContent>
        </NoteCard>
      ))}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            fullWidth
            margin="normal"
            value={currentNote.title}
            onChange={handleInputChange}
          />
          <TextField
            name="content"
            label="Content"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={currentNote.content}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateNote} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DisplayNotes;
