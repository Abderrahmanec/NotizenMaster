import React from "react";
import { TextField } from "@mui/material";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleSearchChange = (e) => {

    setSearchTerm(e.target.value);  // aktuallisiert Suchbegriff

  };

  return (
      <TextField
          label="Suchen nach Notizen"
          variant="standard"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}  // handelt Benutzer texteingabe
          style={{ marginBottom: "20px" }}
          placeholder="Schreibe hier, um nach Notizen zu suchen"
      />
  );
};

export default SearchBar;
