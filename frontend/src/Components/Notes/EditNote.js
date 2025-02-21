import React, { useState, useEffect } from "react"; // Importieren von React und Hooks für den State und Effekte
import { useParams, useNavigate } from "react-router-dom"; // Importieren von Hooks zum Arbeiten mit Routen-Parametern und Navigation
import { getNoteById, updateNote, fetchImagesForNote, deleteImage, handleImageUpload} from "../../api"; // Importieren der API-Funktionen zum Abrufen, Aktualisieren und Löschen von Notizen und Bildern
import { TextField, Button, Card, CardContent, Typography, CircularProgress, Box, Grid, IconButton } from "@mui/material"; // Importieren der Material UI-Komponenten
import { Delete as DeleteIcon } from "@mui/icons-material"; // Importieren des Delete-Icons von Material UI

const EditNote = () => {
  
  const [note, setNote] = useState({ title: "", content: "", tag: "", images: [] }); // State für die Notiz
  const [newImages, setNewImages] = useState([]); // State für das neue Bild
  const [error, setError] = useState(null); // State für Fehlernachrichten
  const [loading, setLoading] = useState(true); // State für Ladeanzeige
  const { id } = useParams(); // Route-Parameter für die Notiz-ID
  const navigate = useNavigate(); // Hook zum Navigieren zwischen Seiten
  const [processing, setProcessing] = useState(false);

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
        setError("Fehler  beim Abrufen der Notiz. Bitte versuchen Sie es erneut."); // Fehlerbehandlung
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
    const files = Array.from(e.target.files);
    if (!files.every(file => file.type.startsWith('image/'))) {
      return setError("Nur Bilddateien sind erlaubt.");
    }
    const previewUrls = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setNewImages(prev => [...prev, ...previewUrls]);
  };

  //handelt delete new image
  const handleDeleteNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handler für das Löschen eines Bildes
  const handleDeleteExistingImage = async (imageId) => {
    setProcessing(true); // Ladeanzeige für das Löschen anzeigen
    try {
      await deleteImage(imageId); // Bild löschen
      setNote(prev =>({
        ...prev,
        images: prev.images.filter((image) => image.id !== imageId), // Bild aus dem State entfernen
      }));
    } catch (err) {
      setError("Fehler beim Löschen des Bildes. Bitte versuchen Sie es erneut."); // Fehlerbehandlung
    }finally {
      setProcessing(false);
    }
  };

  //handelt upload an image
  const handleUploadImages = async () => {
    const formData = new FormData();
    newImages.forEach((img) => {
      formData.append("image", img.file); // Keep using "image" but allow multiple
    });

    try {
      await handleImageUpload(id, formData);
    } catch (error) {
      setError("Fehler beim Hochladen der Bilder.");
    } finally {
      setProcessing(false);
    }
  };





  // Formularübermittlung für das Aktualisieren der Notiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true); // Ladeanzeige für das Aktualisieren anzeigen
    try {
      const updatedData = {
        title: note.title,
        content: note.content,
        tag: note.tag,
      
      };

      // hier wird geprüft, ob neue Bilder hochgeladen werden sollen
      if (newImages.length > 0) {
        await handleUploadImages();
      }

      await updateNote(id, updatedData);




      navigate("/"); // Zurück zur Hauptseite nach erfolgreicher Aktualisierung
    } catch (error) {
      setError("Fehler beim Aktualisieren der Notiz. Bitte versuchen Sie es erneut."); // Fehlerbehandlung
    }
    finally {
      setProcessing(false); // Ladeanzeige beenden
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

              {/* Bild auswählen */}
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                   Bild auswählen
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Button>

                {newImages.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">Neue Bilder:</Typography>
                      <Grid container spacing={1}>
                        {newImages.map((img, index) => (
                            <Grid item key={index} xs={4}>
                              <Box position="relative">
                                <img
                                    src={img.preview}
                                    alt={`Vorschau ${index}`}
                                    style={{
                                      width: '100%',
                                      height: '200px',
                                      objectFit: 'cover',
                                      borderRadius: '4px',

                                    }}
                                />
                                <IconButton onClick={() => handleDeleteNewImage(index)} sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                }}>
                                  <DeleteIcon />
                                </IconButton>

                              </Box>
                              <Typography variant="caption">
                                {img.file.name}
                              </Typography>
                            </Grid>
                        ))}

                      </Grid>
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
                                    position: 'relative',
                                    top: 8,
                                    right: 8,
                                    backgroundColor: 'background.paper',
                                  }}
                                  onClick={() => handleDeleteExistingImage(image.id)}
                                  disabled={processing}
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
                  disabled={processing}
                >
                  {processing ? <CircularProgress size={24} /> : 'Aktualisieren'}
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
