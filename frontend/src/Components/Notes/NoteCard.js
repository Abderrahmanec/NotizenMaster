import React from "react"; // Importieren von React
import { Card, CardContent, Typography, CardMedia, Button } from "@mui/material"; // Importieren der Material UI-Komponenten für das Design

const NoteCard = ({ note, expandedNoteIds, handleToggleContent, handleDelete, navigate }) => {
  // Bild-URL der Notiz, wenn vorhanden
  const imageUrl = note.images && note.images.length > 0 ? note.images[0].url : null;

  // Funktion, um den Inhalt zu kürzen, wenn er zu lang ist
  const truncateContent = (content) => {
    return content && content.length > 25 ? content.substring(0, 25) + "..." : content;
  };

  return (
    <Card
      style={{
        height: "100%", // Karte auf volle Höhe setzen
        display: "flex", // Flexbox für Layout
        flexDirection: "column", // Anordnung der Inhalte vertikal
        borderRadius: "8px", // Abgerundete Ecken
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Schatten für den Kartenrahmen
        transition: "box-shadow 0.3s ease", // Übergangseffekt für den Schatten
        ":hover": { 
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Schatten bei Hover
        },
      }}
    >
      {/* Wenn ein Bild vorhanden ist, wird es oben angezeigt */}
      {imageUrl && (
        <CardMedia
          component="img"
          alt="Note Image"
          height="200"
          image={imageUrl} // Bild-URL der Notiz
          title={note.title} // Titel der Notiz
          style={{ objectFit: "cover", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }} // Bildstil
        />
      )}

      <CardContent style={{ flex: 1 }}>
        {/* Titel der Notiz */}
        <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "10px" }}>
          {note.title}
        </Typography>

        {/* Inhalt der Notiz, der je nach Länge gekürzt oder vollständig angezeigt wird */}
        <Typography variant="body1" style={{ marginBottom: "10px" }}>
          {note.content && note.content.length <= 25
            ? note.content
            : expandedNoteIds.includes(note.id)  // Wenn der Inhalt erweitert wurde, den vollständigen Inhalt anzeigen
            ? note.content
            : truncateContent(note.content)} // Ansonsten den Inhalt kürzen
        </Typography>

        {/* Wenn der Inhalt länger als 25 Zeichen ist, eine Schaltfläche zum Umschalten zwischen "Mehr anzeigen" und "Weniger anzeigen" */}
        {note.content && note.content.length > 25 && (
          <Button
            variant="text"
            color="primary"
            onClick={() => handleToggleContent(note.id)} // Funktion zum Umschalten des Inhalts
            style={{ padding: 0, marginBottom: "10px" }}
          >
            {expandedNoteIds.includes(note.id) ? "Show Less" : "Show More"} {/* Text ändern je nach Zustand */}
          </Button>
        )}

        {/* Tags der Notiz anzeigen */}
        <Typography variant="body2" color="textSecondary" style={{ marginBottom: "10px" }}>
          <strong>Tags:</strong> {note.tags ? note.tags.join(", ") : "No tags available."} {/* Tags anzeigen, wenn vorhanden */}
        </Typography>

        {/* Erstellungsdatum der Notiz anzeigen */}
        <Typography variant="body2" color="textSecondary">
          Created at: {note.createdAt ? new Date(note.createdAt).toLocaleString() : "No date available"} {/* Formatierung des Datums */}
        </Typography>
      </CardContent>

      {/* Schaltflächen für Bearbeiten und Löschen der Notiz */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/edit-note/${note.id}`)} // Navigieren zur Bearbeitungsseite
          style={{ marginRight: "10px" }}
        >
          Edit
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => handleDelete(note.id)}> {/* Löschen der Notiz */}
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default NoteCard;
