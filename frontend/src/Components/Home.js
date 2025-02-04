import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CardMedia } from '@mui/material';
import { jwtDecode } from 'jwt-decode';


const Home = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const checkTokenExpiration = (token) => {
    if (!token) return false;

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp > currentTime;
  };

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      window.location.href = '/login';
      return;
    }

    if (!checkTokenExpiration(token)) {
      alert('Your session has expired. Please log in again.');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/notes/get', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the response data
        setNotes(data);
      } else {
        setError('Error fetching notes.');
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      setError('There was an issue loading your notes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Meine Notizen
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {notes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <Card>
              {/* Add a fallback image here */}
              <CardMedia
                component="img"
                alt="Note Image"
                height="140"
                image={note.imageUrl } // Use a placeholder image if no image URL is provided
                title={note.title}
              />
              <CardContent>
                <Typography variant="h5">{note.title}</Typography>
                <Typography>{note.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
