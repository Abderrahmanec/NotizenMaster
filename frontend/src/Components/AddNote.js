import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

function AddNote() {
  // Zustände für die Eingabefelder und den Status
  const [title, setTitle] = useState(''); // Titel der Notiz
  const [description, setDescription] = useState(''); // Beschreibung der Notiz
  const [tags, setTags] = useState(''); // Tags für die Notiz
  const [images, setImages] = useState([]); // Array für die hochgeladenen Bilder
  const [isSubmitting, setIsSubmitting] = useState(false); // Zustand, ob die Notiz gespeichert wird

  // Funktion zum Hochladen von Bildern
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files); // Dateien als Array extrahieren
    const newImages = files.map((file) => {
      // Überprüfen, ob die Bilddateigröße kleiner als 2MB ist
      if (file.size > 2 * 1024 * 1024) {
        alert('Dateigröße muss kleiner als 2MB sein.');
        return null;
      }
      // Überprüfen, ob der Dateityp ein Bild ist
      if (!file.type.startsWith('image/')) {
        alert('Nur Bilddateien sind erlaubt.');
        return null;
      }
      // Rückgabe des Bildes mit einer Vorschau
      return {
        file,
        preview: URL.createObjectURL(file), // Vorschau der Bilddatei
      };
    }).filter(Boolean); // Alle ungültigen Dateien herausfiltern
    setImages((prevImages) => [...prevImages, ...newImages]); // Bilder zum Zustand hinzufügen
  };

  // Funktion zum Entfernen eines Bildes
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Bild nach Index entfernen
  };

  // Funktion zum Speichern der Notiz
  const handleSaveNote = async () => {
    // Überprüfen, ob Titel und Beschreibung ausgefüllt sind
    if (!title || !description) {
      alert('Titel und Beschreibung sind erforderlich!');
      return;
    }

    // Erstellen des FormData-Objekts zum Senden von Daten an den Server
    const formData = new FormData();
    formData.append('title', title); // Titel der Notiz hinzufügen
    formData.append('description', description); // Beschreibung der Notiz hinzufügen
    formData.append('tags', tags); // Tags der Notiz hinzufügen

    // Holen des Tokens aus dem LocalStorage und Dekodieren
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Benutzer ist nicht authentifiziert!');
      return;
    }

    const decodedToken = jwtDecode(token); // JWT dekodieren, um Benutzerinformationen zu erhalten
    const userId = decodedToken.userId; // Benutzer-ID extrahieren
    const userName = decodedToken.userName; // Benutzername extrahieren
    console.log(`Benutzer ID: ${userId}, Benutzer Name: ${userName}`);

    formData.append('userId', userId); // Benutzer-ID hinzufügen
    images.forEach((image) => {
      formData.append('images', image.file); // Bilder zur FormData hinzufügen
    });

    setIsSubmitting(true); // Setzt den Status auf "wird gesendet"

    // Daten an den Server senden
    try {
      const response = await fetch('http://localhost:8080/notes',{
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Authentifizierung mit dem Token
        },
        body: formData, // Formulardaten (einschließlich Bilder) im Body der Anfrage senden
      });

      // Überprüfen, ob die Antwort erfolgreich war
      if (response.ok) {
        const responseData = await response.json(); // Antwortdaten als JSON parsen
        alert('Notiz erfolgreich gespeichert!');
        console.log('Gespeicherte Notiz:', responseData);
        setTitle(''); // Titel zurücksetzen
        setDescription(''); // Beschreibung zurücksetzen
        setTags(''); // Tags zurücksetzen
        setImages([]); // Bilder zurücksetzen
      } else {
        const errorData = await response.json(); // Fehlerdaten parsen
        alert(`Fehler beim Speichern der Notiz: ${errorData.message || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Notiz:', error);
      alert('Es ist ein Fehler beim Speichern der Notiz aufgetreten.');
    } finally {
      setIsSubmitting(false); // Setzt den Status zurück auf "Nicht senden"
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Neue Notiz hinzufügen
        </Typography>
        {/* Titel der Notiz */}
        <TextField
          label="Titel"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* Beschreibung der Notiz */}
        <TextField
          label="Beschreibung"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Tags der Notiz */}
        <TextField
          label="Tags"
          fullWidth
          margin="normal"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        {/* Bild hochladen Button */}
        <div style={{ margin: '20px 0' }}>
          <Button variant="contained" component="label" color="primary">
            Bilder hochladen
            <input
              type="file"
              accept="image/*"
              hidden
              multiple
              onChange={handleImageUpload}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Speichern...' : 'Notiz speichern'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default AddNote;
