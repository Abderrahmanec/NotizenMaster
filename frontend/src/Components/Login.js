import React, { useState, useEffect } from "react";
import { TextField, Button, IconButton, InputAdornment, Typography, Container, Paper, Grid, Snackbar } from "@mui/material";
import { styled } from "@mui/system";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  

// Stil für das Paper-Element definieren
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

// Stil für das Formular definieren
const Form = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });  // Formulardaten
  const [errors, setErrors] = useState({ username: "", password: "" }); // Fehlerstatus
  const [showPassword, setShowPassword] = useState(false);  // Passwortanzeige steuern
  const [openSnackbar, setOpenSnackbar] = useState(false);  // Snackbar anzeigen
  const [snackbarMessage, setSnackbarMessage] = useState("");  // Snackbar Nachricht
  const [snackbarType, setSnackbarType] = useState("success");  // Snackbar Typ
  const navigate = useNavigate();  // Navigationsfunktion

  // Effekte: Token überprüfen, wenn vorhanden
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);  // Token dekodieren
        console.log("Decoded token:", decodedToken);  
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Snackbar schließen
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Formularänderungen behandeln
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

  // Formular absenden und validieren
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validierung des Benutzernamens
    if (!formData.username) {
      newErrors.username = "Benutzername ist erforderlich";
    }

    // Validierung des Passworts
    if (!formData.password) {
      newErrors.password = "Passwort ist erforderlich";
    } else if (formData.password.length < 6) {
      newErrors.password = "Passwort muss mindestens 6 Zeichen lang sein";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Fehler anzeigen, wenn welche vorhanden sind
      return;
    }

    // Login-Anfrage senden
    fetch("http://localhost:8080/api/auth/login",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSnackbarMessage("Login erfolgreich!"); // Erfolgsmeldung
          setSnackbarType("success");
          setOpenSnackbar(true);

          // Token in localStorage speichern
          console.log("Storing token in localStorage:", data.token);
          localStorage.setItem("token", data.token);

          // Token in localStorage überprüfen
          console.log("Token in localStorage:", localStorage.getItem("token"));

          // Nach einer kurzen Wartezeit zum Dashboard weiterleiten
          setTimeout(() => {
            navigate("/"); // Zum Dashboard navigieren
          }, 1500); // 1,5 Sekunden warten
        } else {
          setSnackbarMessage("Login fehlgeschlagen! Ungültige Anmeldedaten.");
          setSnackbarType("error");
          setOpenSnackbar(true);
        }
      })
      .catch((error) => {
        console.error("Fehler beim Login:", error);
        setSnackbarMessage("Login fehlgeschlagen! Bitte versuche es später erneut.");
        setSnackbarType("error");
        setOpenSnackbar(true);
      });
  };

  // Passwortsichtbarkeit umschalten
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Grid container justifyContent="center" alignItems="center" height="100vh">
        <Grid item>
          <StyledPaper elevation={6}>
            <Typography component="h1" variant="h5" gutterBottom textAlign="center">
              Login
            </Typography>
            <Form onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Benutzername"
                name="username"
                autoComplete="off"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser />
                    </InputAdornment>
                  ),
                }}
                type="text"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Passwort"
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock />
                    </InputAdornment>
                  ),
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  height: "48px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "16px",
                }}
              >
                Login
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <NavLink to="/signup" style={{ textDecoration: "none" }}>
                    <Typography variant="body2" color="primary">
                      Hast du noch kein Konto? Registrieren
                    </Typography>
                  </NavLink>
                </Grid>
              </Grid>
            </Form>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Snackbar-Komponente für Feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarType}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}  // Positionierung
      />
    </Container>
  );
}

export default Login;
