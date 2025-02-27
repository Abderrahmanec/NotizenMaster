import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { Snackbar } from "@mui/material"; // Snackbar von Material UI importieren
import  {logoutUser}  from "../api"; // API-Funktion zum Ausloggen des Benutzers	

// Erstellen des AuthContext mit der React Context API
const AuthContext = createContext();

// AuthProvider-Komponente, die die Authentifizierungslogik bereitstellt und um die gesamte App gewickelt wird
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Hält die Benutzerdaten (vom Token oder der API)
  const [loading, setLoading] = useState(true); // Ladezustand
  const [alertMessage, setAlertMessage] = useState(""); // Hält die Benachrichtigungsnachricht
  const [alertSeverity, setAlertSeverity] = useState("success"); // 'success' oder 'error' Schweregrad

  // Überprüfen der Token-Gültigkeit beim Laden der Komponente
  useEffect(() => {
    const token = localStorage.getItem("token"); // Token aus dem LocalStorage holen
    if (token) {
      try {
        const decodedUser = jwtDecode(token); // Dekodieren des Tokens
        const currentTime = Date.now() / 1000; // Umwandlung in Sekunden
            const email=decodedUser.sub;
            const username=email.split("@")[0];

        if (decodedUser.exp < currentTime) { // Wenn das Token abgelaufen ist
          console.error("Token ist abgelaufen");
          logoutUser(); // Abgelaufenes Token entfernen
          setUser(null); // Benutzerzustand zurücksetzen
          setAlertMessage("Ihre Sitzung ist abgelaufen. Bitte loggen Sie sich erneut ein.");
          setAlertSeverity("error"); // Fehlerbenachrichtigung anzeigen
        } else {
          setUser({ token, username }); // Gültiges Token und Benutzerdaten speichern
          setAlertMessage("Willkommen zurück! Sie sind eingeloggt.");
          setAlertSeverity("success"); // Erfolgsbenachrichtigung anzeigen
        }
      } catch (error) {
        console.error("Fehler beim Dekodieren des Tokens:", error);
        localStorage.removeItem("token"); // Ungültiges Token entfernen
        setUser(null); // Benutzerzustand zurücksetzen
        setAlertMessage("Ungültiges Token. Bitte loggen Sie sich erneut ein.");
        setAlertSeverity("error"); // Fehlerbenachrichtigung anzeigen
      }
    } else {
      setAlertMessage("Bitte loggen Sie sich ein, um auf die App zuzugreifen.");
      setAlertSeverity("info"); // Information, wenn kein Token gefunden wird
    }
    setLoading(false); // Laden beenden nach der Überprüfung des Tokens
  }, []);

  

  // Ladezustand während der Authentifizierungsüberprüfung anzeigen
  if (loading) return <div>Laden...</div>;

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
      {/* Snackbar für Benachrichtigungen */}
      <Snackbar
        open={alertMessage !== ""}
        autoHideDuration={6000}
        onClose={() => setAlertMessage("")}
        message={alertMessage}
        severity={alertSeverity}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          backgroundColor:
            alertSeverity === "error"
              ? "red"
              : alertSeverity === "success"
              ? "green"
              : alertSeverity === "warning"
              ? "orange"
              : "blue",
        }}
      />
    </AuthContext.Provider>
  );
};

// Custom Hook für den Zugriff auf den AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
