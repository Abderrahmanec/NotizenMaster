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
    formData.append("note", JSON.stringify(noteData));

    // Append image file if exists
    
    const response = await api.put(`/notes/editdeep/${noteId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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



 export const handleImageUpload = async (noteId, file) => {
  const formData = new FormData();
  formData.append('image', file);
 console.log("Requesting image upload from editNote...");

  try {
    const response = await fetch(`http://localhost:8080/image/${noteId}/images`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Image added successfully:', data);
      // You can now display the image preview or update the note UI
    } else {
      console.error('Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};
