import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Chip, CircularProgress } from '@mui/material';

const DisplayNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  useEffect(() => {
    setIsLoading(true);
    setError(null);  // Clear any previous error

    // Make the request without including userId in the URL
    fetch(`http://localhost:8080/notes/get`, {

      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // Use token to extract userId from backend
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched notes:', data); // Debugging the response
        setNotes(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
        setError(error.message); // Set the error message
        setIsLoading(false);
      });
  }, [token]);

  if (isLoading) {
    return <CircularProgress />;  // Show a loading spinner instead of text
  }

  if (error) {
    return <Typography color="error">{`Error: ${error}`}</Typography>; // Show error message
  }

  return (
    <div>
      {notes.length === 0 ? (
        <Typography>No notes available</Typography>
      ) : (
        notes.map(note => (
          <Card key={note.id} style={{ margin: '10px' }}>
            <CardContent>
              <Typography variant="h6">{note.title}</Typography>
              <Typography variant="body2">{note.content}</Typography>
              <div>
                {note.tags && note.tags.map((tag, index) => (
                  <Chip key={index} label={tag} style={{ margin: '4px' }} />
                ))}
              </div>
              <div>
                {note.images && note.images.map(image => (
                  <img key={image.id} src={image.url} alt="Note" style={{ width: '100px', height: '100px' }} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default DisplayNotes;
