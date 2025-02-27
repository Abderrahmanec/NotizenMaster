import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';  // Icons für das Umschalten der Sichtbarkeit
import { resetPassword } from '../../api';
import { useNavigate } from 'react-router-dom'; // useNavigate für die Navigation verwenden

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // Zustand für das Umschalten der Passwortsichtbarkeit
  const navigate = useNavigate(); // useNavigate Hook für die Navigation

  // Formular-Handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
  
    // Überprüfung, ob die Passwörter übereinstimmen
    if (newPassword !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
  
    // Überprüfung der Mindestlänge des Passworts
    if (newPassword.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }
  
    // API-Aufruf zur Passwortzurücksetzung
    const response = await resetPassword(newPassword);


    if (response === "Passwort erfolgreich zurückgesetzt") {
    setSuccess("Bitte melden Sie sich mit Ihrem neuen Passwort an");
    setTimeout(() => navigate('/login'), 2000); // Nach Erfolg zur Login-Seite weiterleiten
} else {
    // Wenn response oder response.data nicht vorhanden sind oder success ist false
    setError(response?.data?.error || "Unbekannter Fehler. Bitte versuchen Sie es später erneut.");
}

  };
  

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography variant="h5">Passwort zurücksetzen</Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1em' }}>
          {/* Eingabe für das neue Passwort */}
          <TextField
            label="Neues Passwort"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}  // Sichtbarkeit des Passworts umschalten
            fullWidth
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ marginBottom: '1em' }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}  // Umschalten der Passwortsichtbarkeit
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />} {/* Sichtbarkeitssymbol */}
                </IconButton>
              ),
            }}
          />

          {/* Eingabe für Passwort-Bestätigung */}
          <TextField
            label="Passwort bestätigen"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}  // Sichtbarkeit des Passworts umschalten
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginBottom: '1em' }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}  // Umschalten der Passwortsichtbarkeit
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />} {/* Sichtbarkeitssymbol */}
                </IconButton>
              ),
            }}
          />

          {/* Absenden-Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginBottom: '1em' }}
          >
            Passwort zurücksetzen
          </Button>
        </form>

        {/* Erfolgs- oder Fehlermeldungen */}
        {success && <Typography color="green">{success}</Typography>}
        {error && <Typography color="red">{error}</Typography>}
      </Box>
    </Container>
  );
};

export default ResetPassword;
