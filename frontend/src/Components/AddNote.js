import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Grid } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

function AddNote({ onAddNote }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    console.log('Files uploaded:', files);  // Debugging
    const newImages = files.map((file) => {
      if (file.size > 2 * 1024 * 1024) {
        alert('Dateigröße muss kleiner als 2MB sein.');
        return null;
      }
      if (!file.type.startsWith('image/')) {
        alert('Nur Bilddateien sind erlaubt.');
        return null;
      }
      return {
        file,
        preview: URL.createObjectURL(file),
      };
    }).filter(Boolean);
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSaveNote = async () => {
    if (!title || !description) {
      alert('Titel und Beschreibung sind erforderlich!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Benutzer ist nicht authentifiziert!');
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    formData.append('userId', userId);
    images.forEach((image) => {
      formData.append('images', image.file);
    });

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        alert('Notiz erfolgreich gespeichert!');
        console.log('Gespeicherte Notiz:', responseData);

        if (onAddNote) {
          onAddNote(responseData);
        }

        // Reset form state
        setTitle('');
        setDescription('');
        setTags('');
        setImages([]);
      } else {
        const errorData = await response.json();
        alert(`Fehler beim Speichern der Notiz: ${errorData.message || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Notiz:', error);
      alert('Es ist ein Fehler beim Speichern der Notiz aufgetreten.');
    } finally {
      setIsSubmitting(false);
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
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Beschreibung"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Tags"
          fullWidth
          margin="normal"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
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
