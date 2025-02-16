import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { createNote } from '../../api'; // Importiere die Funktion zum Erstellen einer Notiz

function AddNote({ onAddNote }) {
  const [title, setTitle] = useState(''); // Zustand für den Titel der Notiz
  const [description, setDescription] = useState(''); // Zustand für die Beschreibung der Notiz
  const [tags, setTags] = useState(''); // Zustand für die Tags der Notiz
  const [images, setImages] = useState([]); // Zustand für die hochgeladenen Bilder
  const [isSubmitting, setIsSubmitting] = useState(false); // Zustand, um anzuzeigen, ob die Notiz gerade gespeichert wird

  // Funktion zum Hochladen von Bildern
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files); // Wandle die Datei(en) in ein Array um
    console.log('Hochgeladene Dateien:', files);  // Debugging: Überprüfen der hochgeladenen Dateien
    const newImages = files.map((file) => {
      if (file.size > 2 * 1024 * 1024) {
        alert('Dateigröße muss kleiner als 2MB sein.'); // Fehlermeldung, wenn die Datei zu groß ist
        return null;
      }
      if (!file.type.startsWith('image/')) {
        alert('Nur Bilddateien sind erlaubt.'); // Fehlermeldung, wenn die Datei kein Bild ist
        return null;
      }
      return {
        file,
        preview: URL.createObjectURL(file), // Erstelle eine Vorschau für das Bild
      };
    }).filter(Boolean); // Filtere ungültige Dateien heraus
    setImages((prevImages) => [...prevImages, ...newImages]); // Füge die neuen Bilder zum Zustand hinzu
  };

  // Funktion zum Entfernen eines Bildes
  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(images[index].preview); // Lösche die Vorschau-URL des Bildes
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Entferne das Bild aus dem Zustand
  };

  // Funktion zum Speichern der Notiz
  const handleSaveNote = async () => {
    // Überprüfe, ob alle erforderlichen Felder ausgefüllt sind
    if (!title || !description) {
      alert('Titel und Beschreibung sind erforderlich!');
      return;
    }

    const formData = new FormData(); // FormData erstellen, um die Notizdaten zu speichern
    formData.append('title', title); // Füge den Titel hinzu
    formData.append('description', description); // Füge die Beschreibung hinzu
    formData.append('tags', tags); // Füge die Tags hinzu

    const token = localStorage.getItem('token'); // Holen des Tokens aus dem lokalen Speicher
    if (!token) {
      alert('Benutzer ist nicht authentifiziert!'); // Fehlermeldung, wenn der Benutzer nicht authentifiziert ist
      return;
    }

    const decodedToken = jwtDecode(token); // Dekodiere das Token, um die Benutzer-ID zu erhalten
    const userId = decodedToken.userId;
    formData.append('userId', userId); // Füge die Benutzer-ID hinzu
    images.forEach((image) => {
      formData.append('images', image.file); // Füge die Bilder hinzu
    });

    setIsSubmitting(true); // Setze den Zustand auf 'wird gespeichert'

    try {
      // API-Aufruf zum Erstellen der Notiz
      const responseData = await createNote(formData, token);

      if (responseData) {
        alert('Notiz erfolgreich gespeichert!'); // Erfolgreiche Speicherung der Notiz
        console.log('Gespeicherte Notiz:', responseData);

        if (onAddNote) {
          onAddNote(responseData); // Benachrichtige das übergeordnete Element, dass eine neue Notiz hinzugefügt wurde
        }

        // Setze das Formular zurück
        setTitle('');
        setDescription('');
        setTags('');
        setImages([]);
      } else {
        alert('Fehler beim Speichern der Notiz: Unbekannter Fehler');
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Notiz:', error);
      alert('Es ist ein Fehler beim Speichern der Notiz aufgetreten.');
    } finally {
      setIsSubmitting(false); // Setze den Zustand zurück
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Neue Notiz hinzufügen
        </Typography>
        <TextField
          label="Titel"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Setze den Titel im Zustand
        />
        <TextField
          label="Beschreibung"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Setze die Beschreibung im Zustand
        />
        <TextField
          label="Tags"
          fullWidth
          margin="normal"
          value={tags}
          onChange={(e) => setTags(e.target.value)} // Setze die Tags im Zustand
        />
        <div style={{ margin: '20px 0' }}>
          <Button variant="contained" component="label" color="primary">
            Bilder hochladen
            <input
              type="file"
              accept="image/*"
              hidden
              multiple
              onChange={handleImageUpload} // Bildhochladefunktion auslösen
            />
          </Button>
        </div>

        {/* Anzeige der hochgeladenen Bilder */}
        {images.length > 0 && (
          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            {images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={image.preview}
                    alt={`Hochgeladenes Bild ${index}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                  {/* Button zum Entfernen eines Bildes */}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      fontSize: '10px',
                      padding: '2px 5px',
                    }}
                  >
                    Entfernen
                  </Button>
                </div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Button zum Speichern der Notiz */}
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '20px' }}
          onClick={handleSaveNote}
          disabled={isSubmitting} // Deaktiviere den Button, wenn die Notiz gespeichert wird
        >
          {isSubmitting ? 'Speichern...' : 'Notiz speichern'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default AddNote;
