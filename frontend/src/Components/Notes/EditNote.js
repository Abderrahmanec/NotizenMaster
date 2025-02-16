import React, { useState, useEffect } from "react"; // Importieren von React und Hooks für den State und Effekte
import { useParams, useNavigate } from "react-router-dom"; // Importieren von Hooks zum Arbeiten mit Routen-Parametern und Navigation
import { getNoteById, updateNote, fetchImagesForNote, deleteImage } from "../../api"; // Importieren der API-Funktionen zum Abrufen, Aktualisieren und Löschen von Notizen und Bildern
import { TextField, Button, Card, CardContent, Typography, CircularProgress, Box, Grid, IconButton } from "@mui/material"; // Importieren der Material UI-Komponenten
import { Delete as DeleteIcon } from "@mui/icons-material"; // Importieren des Delete-Icons von Material UI

const EditNote = () => {
  
  const [note, setNote] = useState({ title: "", content: "", tag: "", images: [] }); // State für die Notiz
  const [newImage, setNewImage] = useState(null); // State für das neue Bild
  const [error, setError] = useState(null); // State für Fehlernachrichten
  const [loading, setLoading] = useState(true); // State für Ladeanzeige
  const { id } = useParams(); // Route-Parameter für die Notiz-ID
  const navigate = useNavigate(); // Hook zum Navigieren zwischen Seiten

  // Abrufen der Notiz und der Bilder beim Laden der Seite
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const fetchedNote = await getNoteById(id); // Abrufen der Notiz mit der ID
        console.log("Fetched Note:", fetchedNote);  // Debugging-Ausgabe
        const fetchedImages = await fetchImagesForNote(id); // Abrufen der Bilder zur Notiz
        console.log("Fetched Images:", fetchedImages); // Debugging-Ausgabe
  
        setNote({
          title: fetchedNote.title || "", 
          content: fetchedNote.content || "", 
          tag: fetchedNote.tag || "",
          images: fetchedImages || [], 
        });
      } catch (error) {
        setError("Fehler beim Abrufen der Notiz. Bitte versuchen Sie es erneut."); // Fehlerbehandlung
      } finally {
        setLoading(false); // Ladeanzeige beenden
      }
    };
    fetchNote(); // Funktion ausführen
  }, [id]);

  // Handler für Änderungen der Eingabefelder
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNote({
      ...note,
      [name]: value,
    });
  };

  // Handler für Bildauswahl
  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]); // Das ausgewählte Bild speichern
  };

  // Handler für das Löschen eines Bildes
  const handleDeleteImage = async (imageId) => {
    try {
      await deleteImage(id, imageId); // Bild löschen
      setNote({
        ...note,
        images: note.images.filter((image) => image.id !== imageId), // Bild aus dem State entfernen
      });
    } catch (err) {
      setError("Fehler beim Löschen des Bildes. Bitte versuchen Sie es erneut."); // Fehlerbehandlung
    }
  };

  // Formularübermittlung für das Aktualisieren der Notiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", note.title); // Titel der Notiz hinzufügen
    formData.append("content", note.content); // Inhalt der Notiz hinzufügen
    formData.append("tag", note.tag); // Tag der Notiz hinzufügen

    if (newImage) {
      formData.append("image", newImage); // Neues Bild hinzufügen, falls vorhanden
    }

    try {
      await updateNote(id, formData); // Notiz aktualisieren
      navigate("/"); // Zurück zur Hauptseite nach erfolgreicher Aktualisierung
    } catch (error) {
      setError("Fehler beim Aktualisieren der Notiz. Bitte versuchen Sie es erneut."); // Fehlerbehandlung
    }
  };

  // Wenn die Notiz noch geladen wird, zeigen wir einen Ladeindikator
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress /> {/* Ladeindikator */}
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Card sx={{ width: 600, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Notiz bearbeiten</Typography>
          {error && <Typography color="error">{error}</Typography>} {/* Fehleranzeige */}

          <form onSubmit={handleSubmit}> {/* Formular zur Notizbearbeitung */}
            <Grid container spacing={2}>
              {/* Titel */}
              <Grid item xs={12}>
                <TextField
                  label="Titel"
                  fullWidth
                  value={note.title ?? ""}
                  onChange={handleInputChange}
                  name="title"
                  required
                />
              </Grid>

              {/* Inhalt */}
              <Grid item xs={12}>
                <TextField
                  label="Inhalt"
                  fullWidth
                  multiline
                  rows={4}
                  value={note.content || ""}
                  onChange={handleInputChange}
                  name="content"
                  required
                />
              </Grid>

              {/* Tag */}
              <Grid item xs={12}>
                <TextField
                  label="Tag"
                  fullWidth
                  value={note.tag || ""}
                  onChange={handleInputChange}
                  name="tag"
                />
              </Grid>

              {/* Bild hochladen */}
              <Grid item xs={12}>
                <input type="file" onChange={handleImageChange} /> {/* Bildauswahl */}
              </Grid>

              {/* Bereits hochgeladene Bilder */}
              <Grid item xs={12}>
                {note.images.length > 0 ? (
                  <div>
                    <Typography variant="h6">Bereits hochgeladene Bilder</Typography>
                    {note.images.map((image) => (
                      <Box key={image.id} display="flex" alignItems="center" gap={2} mb={1}>
                        <img
                          src={`http://localhost:8080/images/${image.filename}`}
                          alt={image.filename}
                          width={100}
                          height={100}
                          style={{ borderRadius: "8px", objectFit: "cover", border: "1px solid #ccc" }}
                        />
                        <IconButton onClick={() => handleDeleteImage(image.id)} color="error">
                          <DeleteIcon /> {/* Bild löschen */}
                        </IconButton>
                      </Box>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2">Keine Bilder für diese Notiz vorhanden.</Typography>
                )}
              </Grid>

              {/* Buttons */}
              <Grid item xs={12} display="flex" justifyContent="space-between">
                <Button variant="contained" color="secondary" onClick={() => navigate("/")}>
                  Abbrechen
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Aktualisieren
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditNote;
