import React, { useEffect, useState, useContext } from "react";
import { Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useAuth } from "./AuthContext";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);

  // Fetch notes for the logged-in user
  useEffect(() => {
    if (user) {
      const fetchNotes = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/notes", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setNotes(response.data);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      };
      fetchNotes();
    }
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {notes.map((note, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5">{note.title}</Typography>
                <Typography variant="body2">{note.content}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;