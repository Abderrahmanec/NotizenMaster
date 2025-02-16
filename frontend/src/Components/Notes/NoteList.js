import React from "react";
import { Grid, Typography } from "@mui/material";
import NoteCard from "./NoteCard";

const NoteList = ({ notes, expandedNoteIds, handleToggleContent, handleDelete, navigate }) => {
  return (
    <Grid container spacing={3}>
      {notes.length === 0 ? (
        <Typography>Keine Notizen Verfügbar.</Typography>
      ) : (
        notes.map((note) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
               <NoteCard
              note={note}
              expandedNoteIds={expandedNoteIds}
              handleToggleContent={handleToggleContent}
              handleDelete={handleDelete}
              navigate={navigate}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default NoteList;