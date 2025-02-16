import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar"; // Navbar importieren
import Login from "./Components/Auth/Login"; // Login-Komponente importieren
import Register from "./Components/Auth/Register"; // Registrierungs-Komponente importieren
import Home from "./Components/Home"; // Home-Komponente importieren
import EditNote from "./Components/Notes/EditNote"; // Komponente zum Bearbeiten einer Notiz importieren
import AddNote from "./Components/Notes/AddNote"; // Komponente zum Hinzufügen einer Notiz importieren
import ProtectedRoute from "./Components/ProtectedRoute"; // Geschützte Route importieren (nur für eingeloggte Benutzer zugänglich)
import ForgetPassword from "./Components/Auth/ForgetPassword"; // "Passwort vergessen"-Komponente importieren

const RouteList = ({ toggleDarkMode, darkMode }) => {
  return (
    <>
      {/* Navbar mit Dark Mode Umschalter */}
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      {/* App-Routen */}
      <Routes>
        {/* Öffentliche Routen */}
        <Route path="/login" element={<Login />} /> {/* Login-Seite */}
        <Route path="/register" element={<Register />} /> {/* Registrierungsseite */}

        {/* Geschützte Route zum Hinzufügen von Notizen */}
        <Route
          path="/add-note"
          element={
            <ProtectedRoute>
              <AddNote />
            </ProtectedRoute>
          }
        />

        {/* Geschützte Route zum Bearbeiten einer Notiz */}
        <Route
          path="/edit-note/:id"
          element={
            <ProtectedRoute>
              <EditNote />
            </ProtectedRoute>
          }
        />

        {/* Home-Route */}
        <Route path="/" element={<Home />} /> {/* Startseite */}

        {/* Route für Passwort vergessen */}
        <Route path="/forgot-password" element={<ForgetPassword />} /> {/* "Passwort vergessen"-Seite */}
      </Routes>
    </>
  );
};

export default RouteList;
