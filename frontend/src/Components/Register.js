import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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

function Register() {
  const navigate = useNavigate();  // Navigation bei erfolgreicher Registrierung
  // Zustand für die Formulardaten
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Zustand für die Fehleranzeigen im Formular
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  // Zustand für die Sichtbarkeit des Passworts
  const [showPassword, setShowPassword] = useState(false);

  // Behandlung der Eingabewerte des Formulars
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "", // Fehlernachricht löschen, wenn Benutzer tippt
    }));
  };

  // Formularabsendung und Validierung
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validierung des Benutzernamens
    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    // Validierung des Passworts
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    // Wenn Fehler vorhanden sind, Fehler anzeigen
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Registrierung an den Backend-Server senden
    fetch("http://192.168.178.147:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => { throw new Error(text) });
        }
        return response.text();
      })
      .then((data) => {
        console.log("Antwort vom Backend:", data);
        if (data === "Registration successful") {
          alert("Registration successful!");  // Erfolgsmeldung anzeigen
          navigate("/dash");  // Nach erfolgreicher Registrierung zum Dashboard weiterleiten
        } else {
          alert(data);  // Fehlermeldung vom Server anzeigen
        }
      })
      .catch((error) => {
        console.error("Fehler bei der Registrierung:", error);
        alert("Registration failed! Please try again. Error: " + error.message);
      });
  };

  // Funktion zum Umschalten der Passwortsichtbarkeit
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={6}>
        <Typography component="h1" variant="h5" gutterBottom>
          Register
        </Typography>
        <Form onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            autoComplete="username"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
        </Form>
      </StyledPaper>
    </Container>
  );
}

export default Register;
