package org.bootstmytool.backend.controller;

import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.model.Note;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.bootstmytool.backend.model.User;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * NoteController verwaltet die Endpunkte zur Erstellung von Notizen.
 * Es ermöglicht das Hinzufügen von Notizen mit Titeln, Beschreibungen, Tags und optionalen Bildern.
 * Der Benutzer muss authentifiziert sein, um eine Notiz zu erstellen.
 */
@RestController
@RequestMapping("/notes")
@CrossOrigin(origins = "http://localhost:3000") // Erlaubt Anfragen von der angegebenen Herkunft (z. B. lokale Frontend-Anwendung)
public class NoteController {

    @Autowired
    private org.bootstmytool.backend.service.NoteService noteService; // Service zum Verwalten der Notizen

    @Autowired
    private org.bootstmytool.backend.service.UserService userService; // Service zum Verwalten der Benutzerdaten

    @Autowired
    private org.bootstmytool.backend.service.JwtService jwtService; // Service zum Verwalten des JWT-Tokens

    private static final Logger logger = LoggerFactory.getLogger(NoteController.class); // Logger für den Controller

    /**
     * Endpunkt zum Erstellen einer neuen Notiz.
     * Der Benutzer muss authentifiziert sein, um eine Notiz zu erstellen.
     * Die Notiz kann Titel, Beschreibung, Tags und optional Bilder enthalten.
     *
     * @param authHeader Die Autorisierungs-Header mit dem JWT-Token
     * @param title Der Titel der Notiz
     * @param description Die Beschreibung der Notiz
     * @param tags Komma-getrennte Tags für die Notiz
     * @param images Optional, Bilder, die mit der Notiz verknüpft werden
     * @return ResponseEntity mit dem Ergebnis der Notizerstellung
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createNote(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("tags") String tags,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {

        logger.info("Empfangene Anfrage zum Erstellen einer Notiz mit Titel: {}", title);

        // Überprüfen des Authentifizierungs-Headers
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Fehlender oder ungültiger Autorisierungs-Header.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ungültiger Autorisierungs-Header.");
        }

        String token = authHeader.substring(7); // Extrahiert das Token aus dem Header
        String username = jwtService.extractUsername(token); // Extrahiert den Benutzernamen aus dem JWT-Token

        // Überprüfen, ob der Benutzername gültig ist
        if (username == null) {
            logger.warn("Fehler beim Extrahieren des Benutzernamens aus dem Token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültiges Token.");
        }

        // Benutzerdaten abrufen
        User user = userService.getUserByUsername(username);
        if (user == null) {
            logger.warn("Benutzer nicht gefunden: {}", username);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Benutzer nicht gefunden.");
        }

        logger.info("Erstelle Notiz für Benutzer: {} (ID: {}, Rollen: {})",
                user.getUsername(),
                user.getId());


        try {
            // Erstellen einer neuen Notiz
            org.bootstmytool.backend.model.Note note = new Note();
            note.setTitle(title); // Titel der Notiz
            note.setContent(description); // Inhalt der Notiz

            // Tags in eine Liste umwandeln
            List<String> tagList = Arrays.stream(tags.split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
            note.setTags(tagList); // Tags zuweisen
            note.setUser(user); // Notiz dem Benutzer zuweisen

            // Optional: Bilder zu der Notiz hinzufügen
            if (images != null && images.length > 0) {
                List<Image> imageList = Arrays.stream(images)
                        .map(image -> {
                            try {
                                Image img = new Image();
                                img.setData(image.getBytes()); // Bilddaten extrahieren
                                img.setNote(note); // Bild der Notiz zuweisen
                                return img;
                            } catch (IOException e) {
                                throw new RuntimeException("Fehler beim Verarbeiten des Bildes.", e);
                            }
                        })
                        .collect(Collectors.toList());
                note.setImages(imageList); // Bilder zu der Notiz zuweisen
            }

            // Speichern der Notiz
            Note savedNote = noteService.createNote(note);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "note", savedNote,
                    "user", Map.of(
                            "username", user.getUsername(),
                            "id", user.getId()
                    )
            ));
        } catch (RuntimeException e) {
            logger.error("Fehler beim Erstellen der Notiz für Benutzer {}: {}", username, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fehler beim Erstellen der Notiz.");
        }
    }

}
