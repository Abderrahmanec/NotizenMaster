import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Benutzerdefinierter Context, um Authentifizierungsdaten abzurufen
import { jwtDecode } from "jwt-decode"; // Zum Entschlüsseln von JWT-Tokens

const UserProfile = () => {
  const { user } = useAuth(); // Holt die Benutzerdaten aus dem Context (einschließlich des Tokens)
  const [username, setUsername] = useState(""); // Zustand für den Benutzernamen

  useEffect(() => {
    // Wenn der Benutzer und das Token vorhanden sind
    if (user && user.token) {
      try {
        // Entschlüsselt das JWT-Token
        const decodedToken = jwtDecode(user.token); 
       
        // Setzt den Benutzernamen aus dem 'sub' Claim des Tokens
        setUsername(user.username || "");  
      } catch (error) {
        // Gibt einen Fehler in der Konsole aus, wenn das Entschlüsseln des Tokens fehlschlägt
        console.error('Fehler beim Entschlüsseln des Tokens:', error);
      }
    }
  }, [user]); // Der Effekt wird jedes Mal ausgeführt, wenn sich die Benutzerinformation ändert

  return (
    <div>
      {/* Begrüßt den Benutzer mit seinem Namen (der erste Buchstabe wird großgeschrieben) */}
      <h2>Willkommen, {username.charAt(0).toUpperCase() + username.slice(1)}!</h2>
      {/* Zeigt den Benutzernamen an */}
    </div>
  );
};

export default UserProfile;
