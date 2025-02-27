import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../../api";

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

function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nameLength, setNameLength] = useState("");
  const [emailError, setEmailError] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setEmailError(""); 
  };

  const handleChangeAnswer = (e) => {
    setNameLength(e.target.value);
    setAnswerError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !nameLength) {
      setEmailError(email ? "" : "Email ist erforderlich");
      setAnswerError(nameLength ? "" : "Antwort ist erforderlich");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Bitte eine gültige E-Mail-Adresse eingeben");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyUser(email, nameLength);

      console.log("Success "+res.data.succes);

      if (res.data.success===true) {
      localStorage.setItem("resetPassToken", res.data.token);
        setSuccessMessage("Ein Link zum Zurücksetzen des Passworts wurde gesendet.");
        setSnackbarOpen(true);
        setTimeout(() => navigate("/reset-password"), 3000); // Navigate after 3 seconds
      } else {
        setEmailError("Fehler beim Senden des Links. Bitte später erneut versuchen.");	
      }
    } catch (error) {
      setEmailError("Fehler beim Senden des Links. Bitte später erneut versuchen.");
    } finally {
      setLoading(false);
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
            onChange={handleChangeEmail}
            error={!!emailError}
            helperText={emailError}
            autoComplete="email"
            autoFocus
          />




<TextField
  margin="normal"
  required
  fullWidth
  label="Antwort auf die Sicherheitsfrage"
  name="nameLength"
  value={nameLength}
  onChange={handleChangeAnswer}
  error={!!answerError}
  helperText={answerError}
/>

<Typography variant="body2" color="textSecondary" align="left">
  Die Antwort ist die Anzahl der Buchstaben im Teil Ihrer E-Mail-Adresse vor dem "@"-Symbol.
</Typography>


          {loading ? (
            <CircularProgress />
          ) : (
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Senden
            </Button>
          )}

          <Button fullWidth variant="outlined" onClick={() => navigate("/login")} sx={{ mt: 2 }}>
            Passwort doch noch im Kopf? Zum Login
          </Button>
        </Form>
      </StyledPaper>

      {/* Snackbar for feedback */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ForgetPassword;
