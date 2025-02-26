package org.bootstmytool.backend.controller;

import org.bootstmytool.backend.dto.NoteDTO;
import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.service.ImageService;
import org.bootstmytool.backend.service.JwtService;
import org.bootstmytool.backend.service.NoteService;
import org.bootstmytool.backend.service.UserService;
import org.bootstmytool.backend.model.User;
import org.bootstmytool.backend.utils.ProcessImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @Author: Mohamed Cheikh
 * @Version: 1.0
 * @Date: 2025-03-27
 * <p>
 * NoteController verwaltet die Endpunkte zur Erstellung von Notizen.
 * Es ermöglicht das Hinzufügen von Notizen mit Titeln, Beschreibungen, Tags und optionalen Bildern.
 * Der Benutzer muss authentifiziert sein, um eine Notiz zu erstellen.
 * </p>
 */
@RestController
@RequestMapping("/notes")
@CrossOrigin(origins = "http://localhost:3000")
// Erlaubt Anfragen von der angegebenen Herkunft (z. B. lokale Frontend-Anwendung)
public class NoteController {

    // NoteController-Attribute
    private final NoteService noteService;
    private final UserService userService;
    private final JwtService jwtService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    // NoteController-Konstruktor mit den erforderlichen Services
    @Autowired
    public NoteController(NoteService noteService, UserService userService, JwtService jwtService, ImageService imageService) {
        this.noteService = noteService;
        this.userService = userService;
        this.jwtService = jwtService;
    }


    /**
     * Endpunkt zum Erstellen einer neuen Notiz.
     * Der Benutzer muss authentifiziert sein, um eine Notiz zu erstellen.
     * Die Notiz kann Titel, Beschreibung, Tags und optional Bilder enthalten.
     *
     * @param authHeader  Die Autorisierungs-Header mit dem JWT-Token
     * @param title       Der Titel der Notiz
     * @param description Die Beschreibung der Notiz
     * @param tags        Komma-getrennte Tags für die Notiz
     * @param images      Optional, Bilder, die mit der Notiz verknüpft werden
     * @return ResponseEntity mit dem Ergebnis der Notizerstellung
     */
    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<?> createNote(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("tags") String tags,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {

        try {
            // Validiere den Autorisierung-Header und extrahiere den Benutzer aus dem JWT-Token
            User user = validateAuthorization(authHeader);
            Note note = buildNoteObject(title, description, tags, images, user);
            Note savedNote = noteService.createNote(note);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedNote);
        } catch (IllegalArgumentException | SecurityException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create note.");
        }
    }

    /**
     * Endpunkt zum Abrufen von Notizen für den authentifizierten Benutzer.
     * Der Benutzer muss authentifiziert sein, um Notizen abzurufen.
     *
     * @param authHeader Die Autorisierungs-Header mit dem JWT-Token
     * @return ResponseEntity mit den Notizen des Benutzers
     */
    @GetMapping("/get")
    public ResponseEntity<List<Note>> getNotesForUser(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.emptyList());
        }

        String token = authHeader.substring(7);

        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.emptyList());
        }

        Optional<User> optionalUser = userService.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.emptyList());
        }

        User user = optionalUser.get();

        try {
            List<Note> notes = noteService.getNotesByUserId((int) user.getId());

            if (notes.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            // Ensure the image URL is set correctly for each note
            notes.forEach(note -> {
                if (note.getImages() != null) {
                    note.getImages().forEach(image -> {
                        String imageName = image.getUrl();
                        image.setUrl(baseUrl + "/image/" + imageName);
                    });
                }
            });

            return ResponseEntity.ok(notes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }


    /**
     * Validiert den Autorisierungs-Header und extrahiert den Benutzer aus dem JWT-Token.
     */
    private User validateAuthorization(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new SecurityException("Invalid Authorization header.");
        }
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        if (username == null) {
            throw new SecurityException("Invalid token.");
        }
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new SecurityException("Benutzer nicht gefunden .");
        }
        return user;
    }


    /**
     * Erstellt ein Note-Objekt aus den übergebenen Parametern.
     * Speichert die Bilder im Dateisystem und setzt die URL für jedes Bild.
     *
     * @param title       Der Titel der Notiz
     * @param description Die Beschreibung der Notiz
     * @param tags        Komma-getrennte Tags für die Notiz
     * @param images      Optional, Bilder, die mit der Notiz verknüpft werden
     * @param user        Der Benutzer, dem die Notiz gehört
     * @return Das erstellte Note-Objekt
     */
    private Note buildNoteObject(String title, String description, String tags, MultipartFile[] images, User user) {
        Note note = new Note();
        note.setTitle(title);
        note.setContent(description);
        note.setTags(Arrays.stream(tags.split(",")).map(String::trim).collect(Collectors.toList()));
        note.setUser(user);

        List<Image> imageList = new ArrayList<>();
        if (images != null) {
            imageList = Arrays.stream(images)
                    .map(ProcessImage::processImage)
                    .collect(Collectors.toList());
        }
        note.setImages(imageList);

        return note;
    }

    /**
     * Endpunkt zum Löschen einer Notiz anhand ihrer ID.
     * Der Benutzer muss authentifiziert sein, um eine Notiz zu löschen.
     *
     * @param id Die ID der zu löschenden Notiz
     * @return ResponseEntity mit dem Ergebnis der Löschaktion
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable("id") int id) {
        try {
            String result = noteService.deleteNoteById(id);
            return ResponseEntity.ok().body(result); // Return the fun message
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage()); // Return the fun error message
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Oops!. 🛠️");
        }
    }




    // Diese Methode gibt eine Notiz anhand ihrer ID zurück
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getNoteByIdWithImages(@PathVariable("id") int id) {
        Note note = noteService.getNoteById(id);
        if (note == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nicht gefunden");
        }

        NoteDTO noteDTO = NoteDTO.convertToDto(note);
        return ResponseEntity.ok(noteDTO);
    }


    @PutMapping(value = "/edit/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> editNoteWithoutImag(
            @PathVariable("id") int id,
            @RequestBody NoteDTO noteUpdates,
            @RequestHeader("Authorization") String authHeader) {

        try {
            // Validiere den Autorisierung-Header
            User user = validateAuthorization(authHeader);

            // Ueberpruefen, ob die Notiz existiert
            Note existingNote = noteService.getNoteById(id);
            if (existingNote == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notiz nicht gefunden");
            }

            // Pruefen, ob der Benutzer die Notiz bearbeiten darf
            if (existingNote.getUser().getId() != user.getId()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Sie haben keine Berechtigung, diese Notiz zu bearbeiten");
            }

            // Aktualisiere die Notizdaten
            existingNote.setTitle(noteUpdates.getTitle());
            existingNote.setContent(noteUpdates.getContent());
            existingNote.setTags(noteUpdates.getTags());

            // Speichern der aktualisierten Notiz
            Note updatedNote = noteService.updateNote(existingNote);

            // Konvertiere die aktualisierte Notiz in ein DTO
            NoteDTO responseDto = NoteDTO.convertToDto(updatedNote);

            return ResponseEntity.ok(responseDto);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fehler: " + e.getMessage());
        }
    }

}