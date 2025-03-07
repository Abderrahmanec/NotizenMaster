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
    return true; 
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
export const logoutUser = () => {
  localStorage.removeItem("token");
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


// Beispiel: DELETE-Anfrage zum Löschen einer Notiz
export const deleteNote = async (noteId) => {
  try {
    const response = await makeApiCall("delete", `/notes/delete/${noteId}`);
    if (response && response.message) {
      return { success: true, message: response.message }; // Erfolgsnachricht zurückgeben
    } else {
      return { success: true, message: "Notiz erfolgreich gelöscht" };
    }
  } catch (error) {
    throw new Error(handleApiError(error, "Fehler beim Löschen der Notiz"));
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
    const response = await fetch("http://localhost:8080/notes/create", {
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



// Bilder für eine Notiz abrufen
export const fetchImagesForNote = async (noteId) => {
  try {
    console.log("Request feom editNote to fetch the images...");
    const response = await makeApiCall("get", `/image/note/${noteId}`);
    console.log("Response from ImageController:", response.data);

    response.data.forEach(image => {
      console.log("The url:", image.url);
      console.log("The id:", image.id);
    });

    return response.data; // Return array of images
  } catch (error) {
    console.error("Fehler beim Abrufen der Bilder:", error);
    throw new Error(handleApiError(error, "Fehler beim Abrufen der Bilder"));
  }
};



// Beispiel: GET-Anfrage zum Abrufen einer Notiz anhand der ID
export const getNoteById = async (noteId) => {
  try {
    const response = await makeApiCall("get", `/notes/get/${noteId}`);
    console.log("Fetched Note "+response.data);
    console.log("Fetched Note title: "+response.data.title);
console.log("Fetched Note; "+response.data.tags);
console.log("Fetched Note Images: "+response.data.images);
console.log("Fetched Note url: "+response.data.url);
    console.log("Fetched Note content"+response.data.content);
    console.log(typeof response.data)
    return response.data; // Rückgabe der abgerufenen Notiz
  } catch (error) {
    throw new Error(handleApiError(error, `Fehler beim Abrufen der Notiz mit ID: ${noteId}`));
  }

};

// Beispiel: PUT-Anfrage zum Aktualisieren einer Notiz
export const updateNote = async (noteId, noteData) => {
  try {
    const formData = new FormData();

    // Append note data as JSON string
    formData.append("title", noteData.title);
    formData.append("content", noteData.content);
    formData.append("tag", noteData.tag);

    // Append image file if exists
    
    const response = await api.put(`/notes/edit/${noteId}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error, "Error updating note"));
  }
};

// Beispiel: POST-Anfrage zum Erstellen einer Notiz
export const deleteImage = async (imageId) => {
  try {
    console.log("Requesting deleteImage to delete image with id: " + imageId);

    const response = await fetch(`http://localhost:8080/image/delete/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error deleting image:", error);
  }
};



 export const handleImageUpload = async (noteId, formData) => {

 console.log("Requesting image upload from editNote...");

  try {
    const response = await fetch(`http://localhost:8080/image/${noteId}/images`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Image added successfully:', data);
      
    } else {
      console.error('Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};




export const verifyUser = async (email, nameLength) => {
  console.log('Resetting password for email:', email, "and nameLength:", nameLength);

  try {
    // Make the POST request with JSON body
    const res = await axios.post('http://localhost:8080/api/auth/verify', { email, nameLength }, {
      headers: {
        'Content-Type': 'application/json' 
      }
    });
console.log('reset-password response:', res.data);
console.log('the succes:', res.data.success);
    // Return success message from backend
    return res;
  } catch (error) {
    // Handle error if it happens (e.g., 400 or 500 errors)
    console.error('Error resetting password:', error);
    return error.response?.data || "Ein Fehler ist aufgetreten"; 
  }
};

 




export const resetPassword = async (newPassword) => {
  try {
    const token = localStorage.getItem('resetPassToken');
    const response = await axios.post('http://localhost:8080/api/auth/reset-password', 
      { newPassword },
      {
        params: {
          token: token 
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

    console.log('API Response:', response);  // Überprüfe die gesamte API-Antwort

    // Rückgabe der Antwortdaten für den weiteren Gebrauch
    localStorage.removeItem('resetPassToken');  // Token nach der Anfrage löschen
    console.log('Response data:', response.data);
    return response.data;  // Nur die relevanten Daten zurückgeben
  } catch (error) {
    console.error('Error resetting password:', error);  // Logge detaillierte Fehler

    // Wenn kein `response.data` vorhanden ist, dann gib eine allgemeine Fehlermeldung zurück
    return error.response?.data || { success: false, error: "Unbekannter Fehler. Bitte versuchen Sie es später erneut." };
  }
};