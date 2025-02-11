package org.bootstmytool.backend.controller;

import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.service.JwtService;
import org.bootstmytool.backend.service.NoteService;
import org.bootstmytool.backend.service.UserService;
import org.bootstmytool.backend.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.*;
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

    // NoteController-Attribute
    private final NoteService noteService;
    private final UserService userService;
    private final JwtService jwtService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

   // NoteController-Konstruktor mit den erforderlichen Services
    @Autowired
    public NoteController(NoteService noteService, UserService userService, JwtService jwtService) {
        this.noteService = noteService;
        this.userService = userService;
        this.jwtService = jwtService;
    }
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

        try {
            User user = validateAuthorization(authHeader);
            Note note = buildNoteObject(title, description, tags, images, user);
            Note savedNote = noteService.createNote(note);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedNote);
        } catch (IllegalArgumentException | SecurityException e) {
            logger.warn(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating note: {}", e.getMessage(), e);
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
            logger.warn("Invalid Authorization header");
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
            logger.warn("User not found: {}", username);
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
     * @param authHeader
     * @return
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
     * @param title
     * @param description
     * @param tags
     * @param images
     * @param user
     * @return
     */
    private Note buildNoteObject(String title, String description, String tags, MultipartFile[] images, User user) {
        Note note = new Note();
        note.setTitle(title);
        note.setContent(description);
        note.setTags(Arrays.stream(tags.split(",")).map(String::trim).collect(Collectors.toList()));
        note.setUser(user);

        if (images != null) {
            // Add processed images to the note
            note.setImages(Arrays.stream(images).map(this::processImage).collect(Collectors.toList()));
        }

        return note;
    }

    /**
     * Processes behandelte das Bild und speichert es im Dateisystem.
     * @param file
     * @return
     */
    private Image processImage(MultipartFile file) {
        try {
            // Create directory if it doesn't exist
            Path imagePath = Path.of("backend/src/main/resources/static/images/"); // Correct directory for static images
            if (!Files.exists(imagePath)) {
                Files.createDirectories(imagePath);
            }

            // Create a unique filename by appending a timestamp
          //  String imageName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String imageName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");
            Path targetPath = imagePath.resolve(imageName);

            // Save image to the file system
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Create image entity
            Image image = new Image();
            image.setData(file.getBytes());
            image.setUrl(imageName);  // Store only the image name
            return image;
        } catch (IOException e) {
            logger.warn("Error processing image {}: {}", file.getOriginalFilename(), e.getMessage());
            throw new RuntimeException("Error processing image.");
        }
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


    /**
     * Endpunkt zum Bearbeiten einer Notiz anhand ihrer ID.
     * Der Benutzer muss authentifiziert sein, um eine Notiz zu bearbeiten.
     *
     * @param id Die ID der zu bearbeitenden Notiz
     * @param note Die aktualisierte Notiz
     * @return ResponseEntity mit der aktualisierten Notiz
     */
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editNote(@PathVariable("id") int id, @RequestBody Note note) {
        try {
            // Log the received note and ID
            System.out.println("Editing note with ID: " + id);
            System.out.println("Received note: " + note);

            // Perform validation checks
            if (note == null) {
                return ResponseEntity.badRequest().body("Note data is required.");
            }
            if (note.getId() != 0 && note.getId() != id) {
                return ResponseEntity.badRequest().body("ID in the path does not match the ID in the note object.");
            }

            // Call the service to update the note
            Note updatedNote = noteService.editNoteById(id, note);

            // Check if the note was updated
            if (updatedNote == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update the note.");
            }

            // Return updated note
            return ResponseEntity.ok(updatedNote);
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found: " + ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid data: " + ex.getMessage());
        }
    }


    /**
     * Endpunkt zum Suchen von Notizen anhand eines Suchbegriffs.
     * Der Benutzer muss authentifiziert sein, um Notizen zu suchen.
     *
     * @param searchTerm Der Suchbegriff
     * @return ResponseEntity mit den gefilterten Notizen
     */
    @GetMapping("/search/{searchTerm}")
    public ResponseEntity<List<Note>> searchNotes(@PathVariable String searchTerm) {
        try {
            List<Note> notes = noteService.searchNotes(searchTerm);
            return ResponseEntity.ok(notes); // Return filtered notes
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // Return error response if something goes wrong
        }
    }

}



