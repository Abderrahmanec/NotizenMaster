// Importiere notwendige Material-UI-Komponenten und Icons
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api";

// Styled Paper für das UI
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

// Styled Form für das Formular
const Form = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

function Register() {
  // Navigation mit React Router
  const navigate = useNavigate();
  // State für Erfolgsmeldung
  const [successMessage, setSuccessMessage] = useState(false);

  // State für Formulardaten und Fehler
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State für die Passwortsichtbarkeit
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle für Änderungen im Formular
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Handle für das Absenden des Formulars
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validierung der Eingaben
    
    if (!formData.email) newErrors.email = "Email ist erforderlich";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) // Überprüft das E-Mail-Format mit einer RegEx
      newErrors.email = "Bitte gib eine gültige E-Mail-Adresse ein";
    

    if (!formData.password) newErrors.password = "Passwort ist erforderlich";
    else if (formData.password.length < 6)
      newErrors.password = "Das Passwort muss mindestens 6 Zeichen lang sein";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Bitte bestätige dein Passwort";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwörter stimmen nicht überein";

    // Wenn Fehler vorhanden sind, setze Fehler und beende
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Registrierung mit den Formulardaten
    const registrationData = {
      email: formData.email.toLowerCase(),
      password: formData.password,
    };

    try {
      // API-Aufruf zur Registrierung
      const result = await registerUser(registrationData);

      // Wenn Registrierung erfolgreich
      if (result === "Registrierung erfolgreich") {
        setSuccessMessage(true); // Erfolgsmeldung anzeigen

        setTimeout(() => {
          navigate("/login"); // Weiterleitung zur Login-Seite nach 2 Sekunden
        }, 2000);
      }
    } catch (error) {
      console.error("Fehler bei der Registrierung:", error);
      alert("Registrierung fehlgeschlagen! Bitte versuche es später erneut.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={6}>
        <Typography component="h1" variant="h5" gutterBottom>
          Registrierung
        </Typography>
        <Form onSubmit={handleSubmit} noValidate>
          {/* Benutzername */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          {/* Passwort */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Passwort"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* Passwort Bestätigung */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Passwort bestätigen"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* Registrieren Button */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Registrieren
          </Button>
        </Form>
      </StyledPaper>

      {/* Snackbar für Erfolgsnachricht */}
      <Snackbar open={successMessage} autoHideDuration={2000}>
        <Alert severity="success">Registrierung erfolgreich! Weiterleitung...</Alert>
      </Snackbar>
    </Container>
  );
}

export default Register;
