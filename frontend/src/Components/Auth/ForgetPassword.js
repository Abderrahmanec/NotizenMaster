import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

// Styled Paper-Komponente für das Design
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "400px",
  margin: "auto",
  marginTop: theme.spacing(8),
  borderRadius: "12px",
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
}));

// Formularstil definieren
const Form = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

function ForgetPassword() {
  const navigate = useNavigate();
  
  // Zustand für die Formulardaten
  const [email, setEmail] = useState("");
  
  // Zustand für Fehleranzeigen
  const [error, setError] = useState("");
  
  // Zustand für den Ladeindikator
  const [loading, setLoading] = useState(false);

  // Funktion zum Bearbeiten des Email-Eingabefelds
  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Fehler zurücksetzen, wenn der Benutzer etwas tippt
  };

  // Formularabsendung
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validierung des Email-Felds
    if (!email) {
      setError("Email ist erforderlich");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Bitte eine gültige E-Mail-Adresse eingeben");
      return;
    }

    setLoading(true);
    
    try {
      // Anfrage an das Backend senden (API-URL besser aus Umgebungsvariablen laden)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Falls die Antwort kein "ok" ist, Fehler auslesen und werfen
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.text();
      console.log("Antwort vom Backend:", data);

      // Erfolgreiche Antwort prüfen
      if (data === "Password reset link sent") {
        alert("Ein Link zum Zurücksetzen des Passworts wurde an Ihre E-Mail gesendet.");
        navigate("/login");
      } else {
        setError(data); // Fehlermeldung vom Server anzeigen
      }
    } catch (error) {
      console.error("Fehler bei der Passwort-Zurücksetzung:", error);
      setError("Fehler beim Senden des Links. Bitte später erneut versuchen.");
    } finally {
      setLoading(false); // Ladeanzeige zurücksetzen
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={6}>
        <Typography component="h1" variant="h5" gutterBottom>
          Passwort vergessen
        </Typography>
        <Form onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="E-Mail-Adresse"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            error={!!error}
            helperText={error}
            autoComplete="email"
            autoFocus
          />
          
          {loading ? (
            <CircularProgress />
          ) : (
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Senden
            </Button>
          )}

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{ mt: 2 }}
          >
            Passwort doch noch im Kopf? Zum Login
          </Button>
        </Form>
      </StyledPaper>
    </Container>
  );
}

export default ForgetPassword;
