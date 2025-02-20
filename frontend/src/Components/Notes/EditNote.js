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
  const [deleting, setDeleting] = useState(false);// State für das Löschen der Notiz
 

  // Abrufen der Notiz und der Bilder beim Laden der Seite
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const [fetchedNote, fetchedImages] = await Promise.all([
          getNoteById(id),
          fetchImagesForNote(id).catch(() => []) // Return empty array if images not found
        ]);

        setNote({
          title: fetchedNote.title || "", 
          content: fetchedNote.content || "", 
          tag: fetchedNote.tags || "",
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
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Erstellen eines neuen Bildobjekts
      setNewImage({
        file: file,
        preview: URL.createObjectURL(file) // Vorschau des Bildes
      });
    } else {
      setError("Bitte wählen Sie ein gültiges Bild aus."); // Fehlerbehandlung
    }
  };

  // Handler für das Löschen eines Bildes
  const handleDeleteImage = async (imageId) => {
    setDeleting(true); // Ladeanzeige für das Löschen anzeigen
    try {
      await deleteImage(imageId); // Bild löschen
      setNote(prev =>({
        ...prev,
        images: note.images.filter((image) => image.id !== imageId), // Bild aus dem State entfernen
      }));
    } catch (err) {
      setError("Fehler beim Löschen des Bildes. Bitte versuchen Sie es erneut."); // Fehlerbehandlung
    }finally {
      setDeleting(false);
    }
  };

  // Formularübermittlung für das Aktualisieren der Notiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        title: note.title,
        content: note.content,
        tag: note.tag,
      
      };

      const response = await updateNote(id, updatedData, newImage);

      // Lade die aktualisierte Notiz in den State
      setNote({
        ...response,
        images: response.images || []
      });

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
                  value={note.title }
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
                  value={note.content}
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
                  value={note.tag}
                  onChange={handleInputChange}
                  name="tag"
                />
              </Grid>

              {/* Bild hochladen */}
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                   Bild hochladen
                  <input
                    type="file"
                    hidden
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Button>
                {newImage && newImage.preview && (
                  <Box sx={{ mb: 3 }}>
                    <img
                      src={newImage.preview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Ausgewählt: {newImage.file.name}
                    </Typography>
                  </Box>
                )}

              </Grid>

              {/* Bereits hochgeladene Bilder */}
              <Grid item xs={12}>
                {note.images.length > 0 ? (
                  <div>
                    <Typography variant="h6">Bereits hochgeladene Bilder</Typography>
                    {note.images.map((image) => (
                      <Box key={image.id} display="flex" alignItems="center" gap={2} mb={1}>
                        <img
                          src={`${image.url}`}
                          alt={image.filename}
                          width="30%"
                          height="40%"
                          style={{ borderRadius: 1, objectFit: "cover", border: "1px solid #ccc" , 
                            position: "relative",
                            mb:4
                          }}
                        />

                         <IconButton   sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    backgroundColor: 'background.paper',
                                  }}
                                  onClick={() => handleDeleteImage(image.id)}
                                  disabled={deleting}
                                >
                          <DeleteIcon /> {/* Bild löschen */}
                        </IconButton>
                      </Box>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" color="text.secondary">Keine Bilder für diese Notiz vorhanden.</Typography>
                )}
              </Grid>

              {/* Buttons */}
              <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                >
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={deleting}
                >
                  {deleting ? <CircularProgress size={24} /> : 'Aktualisieren'}
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
