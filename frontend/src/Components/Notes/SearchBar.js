// Die "SearchBar"-Komponente ermöglicht das Suchen von Notizen
// Sie erhält zwei Props:
// - searchTerm: Der aktuelle Suchbegriff, der vom übergeordneten Zustand gesteuert wird
// - setSearchTerm: Eine Funktion, die den Suchbegriff im übergeordneten Zustand aktualisiert

// Wenn der Benutzer im Eingabefeld tippt, wird die handleSearchChange-Funktion aufgerufen,
// die den neuen Suchbegriff an die übergeordnete Komponente übergibt.

import React from "react";
import { TextField } from "@mui/material";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  // Funktion zum Behandeln von Eingabewerten
  const handleSearchChange = (e) => {
    // Aktualisiert den Suchbegriff in der übergeordneten Komponente
    setSearchTerm(e.target.value);
  };

  return (
    <TextField
      label="Search Notes"  // Das Label des Textfelds für die Suchleiste
      variant="outlined"     // Die Textfeld-Variante, die den Rahmen um das Feld hinzufügt
      fullWidth              // Das Textfeld nimmt die gesamte Breite des Containers ein
      value={searchTerm}     // Der Wert des Textfelds wird durch die übergeordnete Komponente gesteuert
      onChange={handleSearchChange}  // Überwacht Änderungen im Eingabefeld
      style={{ marginBottom: "20px" }} // Fügt dem Textfeld einen unteren Rand hinzu
      aria-label="Search Notes"  // Verbesserung der Zugänglichkeit, um den Zweck des Felds zu beschreiben
      placeholder="Type to search notes..."  // Platzhaltertext, wenn das Feld leer ist
    />
  );
};

export default SearchBar;
