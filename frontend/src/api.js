import axios from "axios"; // Importiere Axios für HTTP-Anfragen
import { jwtDecode } from "jwt-decode"; // Importiere jwt-decode für JWT-Token dekodierung

// Setze die Basis-URL für API-Aufrufe (hier als lokale Entwicklungsumgebung)
const API_URL = "http://localhost:8080";

// Erstelle eine Axios-Instanz mit Standardkonfiguration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json", // Standardmäßiger Header für JSON-Daten
  },
});

// Zentrale Fehlerbehandlung für API-Aufrufe
const handleApiError = (error, defaultMessage) => {
  if (error.response) {
    console.error("API-Fehler:", error.response.data);
    return error.response.data.message || defaultMessage;
  } else if (error.request) {
    console.error("Netzwerkfehler:", error.request);
    return "Netzwerkfehler. Bitte versuche es erneut.";
  } else {
    console.error("Fehler:", error.message);
    return defaultMessage;
  }
};

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  } catch (error) {
    return true; // Treat as expired if decoding fails
  }
};

// Authentifizierungs-Token aus localStorage abrufen
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Setzt den Authorization-Header mit dem Token
const setAuthHeader = () => {
  const token = getAuthToken();
  if (token && !isTokenExpired(token)) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    logoutUser(); // wenn das Token abgelaufen ist, wird der Benutzer abgemeldet
  }
};

// Logout method
const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Redirect to login page
};

// Wiederverwendbare Funktion für API-Aufrufe
const makeApiCall = async (method, url, data = null) => {
  setAuthHeader(); // Stelle sicher, dass das Token im Header enthalten ist
  try {
    const response = await api({ method, url, data });
    return response;
  } catch (error) {
    throw new Error(handleApiError(error, `Fehler beim ${method} von ${url}`));
  }
};

// Beispiel: GET-Anfrage zum Abrufen aller Notizen
export const getNotes = async () => {
  try {
    const response = await makeApiCall("get", "/notes/get");

    // Überprüfe, ob die Anfrage erfolgreich war (Status 200–299)
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Rückgabe der abgerufenen Notizen
    } else {
      throw new Error(`Fehler beim Abrufen der Notizen: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(handleApiError(error, "Fehler beim Abrufen der Notizen"));
  }
};

// Beispiel: PUT-Anfrage zum Aktualisieren einer Notiz
export const updateNote = async (noteId, updatedData) => {
  return makeApiCall("put", `/notes/edit/${noteId}`, updatedData);
};

// Beispiel: DELETE-Anfrage zum Löschen einer Notiz
export const deleteNote = async (noteId) => {
  try {
    const response = await makeApiCall("delete", `/notes/${noteId}`);
    if (response && response.message) {
      return { success: true, message: response.message }; // Erfolgsnachricht zurückgeben
    } else {
      return { success: true, message: "Notiz erfolgreich gelöscht" };
    }
  } catch (error) {
    throw new Error(handleApiError(error, "Fehler beim Löschen der Notiz"));
  }
};

// Beispiel: GET-Anfrage zum Abrufen einer Notiz anhand der ID
export const getNoteById = async (noteId) => {
  return makeApiCall("get", `/notes/${noteId}`);
};

// Bilder für eine Notiz abrufen
export const fetchImagesForNote = async (noteId) => {
  try {
    const response = await makeApiCall("get", `/notes/${noteId}/images`);
    return response; // Array mit Bildern zurückgeben
  } catch (error) {
    console.error("Fehler beim Abrufen der Bilder:", error);
    throw new Error(handleApiError(error, "Fehler beim Abrufen der Bilder"));
  }
};

// Suchfunktion für Notizen
export const searchNotes = async (searchTerm) => {
  try {
    const response = await makeApiCall("get", `/notes/search/${searchTerm}`, searchTerm);
    return response.data; // Rückgabe der gefundenen Notizen
  } catch (error) {
    throw new Error(handleApiError(error, `Fehler bei der Suche nach Notizen mit Begriff: ${searchTerm}`));
  }
};

// Benutzeranmeldung (Login)
export const loginUser = async (userData) => {
  try {
    const response = await makeApiCall("post", "/api/auth/login", userData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error, "Fehler bei der Anmeldung"));
  }
};

// Benutzerregistrierung (Sign-Up)
export const registerUser = async (userData) => {
  try {
    const response = await makeApiCall("post", "/api/auth/register", userData);
    console.log("Rohantwort der API:", response); // Logge die komplette API-Antwort
    return response.data; // Stelle sicher, dass die richtige Datenstruktur zurückgegeben wird
  } catch (error) {
    console.error("API-Fehler:", error);
    throw error;
  }
};

// Neue Notiz erstellen
export const createNote = async (formData, token) => {
  try {
    const response = await fetch("http://localhost:8080/notes", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Fehler beim Erstellen der Notiz");
    }

    const responseData = await response.json();
    return responseData; // Rückgabe der erstellten Notiz-Daten
  } catch (error) {
    console.error("Fehler beim Erstellen der Notiz:", error);
    throw error;
  }
};

// Bild löschen
export const deleteImage = async (noteId, imageId) => {
  try {
    const response = await api.delete(`/notes/${noteId}/images/${imageId}`);
    if (response.status === 200) {
      return response.data; // Erfolgsnachricht oder relevante Daten zurückgeben
    } else {
      throw new Error("Fehler beim Löschen des Bildes.");
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Bildes:", error);
    throw new Error("Fehler beim Löschen des Bildes. Bitte versuche es erneut.");
  }
};
