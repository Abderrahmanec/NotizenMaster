// Importiere benötigte Bibliotheken und Komponenten
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Container,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { useNavigate, NavLink } from "react-router-dom"; // Importiere NavLink für das Routing
import { jwtDecode } from "jwt-decode";
import { loginUser } from "../../api";
import { useAuth } from "../../context/AuthContext";

// Styled Components für das Design von Paper und Formular
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

const Form = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

export function Login() {
  // Zustandsvariablen für Formulardaten, Fehler, Snackbar und Passwortsichtbarkeit
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Überprüft, ob bereits ein Token im lokalen Speicher vorhanden ist
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Dekodiert das Token, um Benutzerdaten zu extrahieren
        console.log("Decoded token:", decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error); // Fehlerbehandlung falls das Token ungültig ist
      }
    }
  }, []);

  // Schließt das Snackbar für Rückmeldungen
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Behandelt Änderungen der Formulareingaben
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Formulardaten aktualisieren
    setErrors((prev) => ({ ...prev, [name]: "" })); // Fehlernachricht zurücksetzen
  };

  // Behandelt die Formularübermittlung und validiert die Eingaben
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validierung der Formulareingaben
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email ist erforderlich";
    if (!formData.password) newErrors.password = "Passwort ist erforderlich";
    else if (formData.password.length < 6)
      newErrors.password = "Passwort muss mindestens 6 Zeichen lang sein";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Fehler setzen, wenn Eingaben ungültig sind
      return;
    }


    // E-Mail in Kleinbuchstaben umwandeln
  const dataToSubmit = {
    email: formData.email.toLowerCase(),
    password: formData.password,
  };

    try {
      const data = await loginUser(dataToSubmit); // Versucht, den Benutzer mit den Formulardaten anzumelden

      if (data.success) {
        localStorage.setItem("token", data.token); // Speichert das Token im lokalen Speicher
        const decodedUser = jwtDecode(data.token); // Dekodiert das Token, um Benutzerdaten zu extrahieren
        const email = decodedUser.sub.split("@")[0];
        setUser({ token: data.token, email: email ?? "" }); // Benutzerstatus global im Kontext aktualisieren

        setSnackbarMessage("Login erfolgreich!"); // Erfolgreiche Anmeldung
        setSnackbarType("success");
        setOpenSnackbar(true); // Zeigt das Snackbar mit Erfolgsmeldung an

        setTimeout(() => {
          navigate("/"); // Weiterleitung zum Dashboard nach erfolgreichem Login
        }, 1500);
      } else {
        throw new Error("Ungültige Anmeldedaten"); // Fehler bei ungültigen Anmeldedaten
      }
    } catch (error) {
      console.error("Fehler beim Login:", error);
      setSnackbarMessage("Login fehlgeschlagen! Bitte versuche es später erneut."); // Fehlernachricht im Snackbar
      setSnackbarType("error");
      setOpenSnackbar(true);
    }
  };

  // Umschalten der Sichtbarkeit des Passworts
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Passwort Sichtbarkeit umschalten
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
              {/* Benutzername Eingabefeld */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser />
                    </InputAdornment>
                  ),
                }}
              />
              {/* Passwort Eingabefeld */}
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
              {/* Absenden Button */}
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
              {/* Passwort vergessen Link */}
              <Grid container justifyContent="center">
                <Grid item>
                  <NavLink to="/forgot-password" style={{ textDecoration: "none" }}>
                    <Typography variant="body2" color="primary">
                      Passwort vergessen?
                    </Typography>
                  </NavLink>
                </Grid>
              </Grid>
              {/* Registrieren Link */}
              <Grid container justifyContent="center">
                <Grid item>
                  <NavLink to="/register" style={{ textDecoration: "none" }}>
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
      {/* Snackbar für Feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarType}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
