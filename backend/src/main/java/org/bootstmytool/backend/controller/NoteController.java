package org.bootstmytool.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bootstmytool.backend.dto.ImageDTO;
import org.bootstmytool.backend.dto.NoteDTO;
import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.repository.ImageRepository;
import org.bootstmytool.backend.service.ImageService;
import org.bootstmytool.backend.service.JwtService;
import org.bootstmytool.backend.service.NoteService;
import org.bootstmytool.backend.service.UserService;
import org.bootstmytool.backend.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final ImageService imageService;
    private final ImageRepository imageRepository;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    // NoteController-Konstruktor mit den erforderlichen Services
    @Autowired
    public NoteController(NoteService noteService, UserService userService, JwtService jwtService, ImageService imageService, ImageRepository imageRepository) {
        this.noteService = noteService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.imageService = imageService;
        this.imageRepository = imageRepository;
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

        List<Image> imageList = new ArrayList<>();
        if (images != null) {
            imageList = Arrays.stream(images)
                    .map(this::processImage)
                    .collect(Collectors.toList());
        }
        note.setImages(imageList);

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
            Path imagePath = Path.of("backend/src/main/resources/static/images/");
            if (!Files.exists(imagePath)) {
                Files.createDirectories(imagePath);
            }

            //erstelle einen eindeutigen Bildnamen
            //  String imageName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String imageName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");
            Path targetPath = imagePath.resolve(imageName);

            // speichere das Bild im Dateisystem
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // erstelle ein Image-Objekt und setze die Bilddaten
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
     * Endpunkt zum Suchen von Notizen anhand eines Suchbegriffs.
     * Der Benutzer muss authentifiziert sein, um Notizen zu suchen.
     *
     * @param searchTerm Der Suchbegriff
     * @return ResponseEntity mit den gefilterten Notizen
     */
    @GetMapping("/search/{searchTerm}")
    public ResponseEntity<List<Note>> searchNotes(@PathVariable String searchTerm) {
        try {

            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            List<Note> notes = noteService.searchNotes(searchTerm, username);

            return ResponseEntity.ok(notes); // Return filtered notes
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // Return error response if something goes wrong
        }
    }





    @GetMapping("/edit/{id}")
    public ResponseEntity<?> getNoteById(@PathVariable("id") int id) {
        Note note = noteService.getNoteById(id);

        // .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(convertToDto(note));
    }





    /**
     * Endpunkt zum Bearbeiten einer Notiz anhand ihrer ID.
     * Der Benutzer muss authentifiziert sein, um eine Notiz zu bearbeiten.
     *
     * @param id Die ID der zu bearbeitenden Notiz
     * @return ResponseEntity mit der aktualisierten Notiz
     */
    @PutMapping(value = "/edites/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> editNote1(
            @PathVariable("id") int id,
            @RequestPart("note") String noteJson,
            @RequestPart(value = "images", required = false) MultipartFile[] newImages,
            @RequestHeader("Authorization") String authHeader) {

        try {
            // Validate authorization
            User user = validateAuthorization(authHeader);

            // Get existing note
            Note existingNote = noteService.getNoteById(id);

            // Check ownership
            if (existingNote.getUser().getId() != user.getId()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You don't have permission to edit this note");
            }

            // Convert JSON to NoteDTO
            ObjectMapper objectMapper = new ObjectMapper();
            NoteDTO noteUpdates = objectMapper.readValue(noteJson, NoteDTO.class);

            // Update note fields
            existingNote.setTitle(noteUpdates.getTitle());
            existingNote.setContent(noteUpdates.getContent());
            existingNote.setTags(noteUpdates.getTags());

            // Initialize images list if it's null
            if (existingNote.getImages() == null) {
                existingNote.setImages(new ArrayList<>());
            }

            // Handle image deletion if provided in NoteDTO (assuming you add a field for that)
            if (noteUpdates.getImagesToDelete() != null && !noteUpdates.getImagesToDelete().isEmpty()) {
                existingNote.setImages(existingNote.getImages().stream()
                        .filter(image -> !noteUpdates.getImagesToDelete().contains(image.getId()))
                        .collect(Collectors.toList()));
            }

            // Handle new images addition
            if (newImages != null && newImages.length > 0) {
                List<Image> processedImages = Arrays.stream(newImages)
                        .map(file -> {
                            Image img = processImage(file);
                            // IMPORTANT: set the note reference on the image if needed.
                            img.setNote(existingNote);
                            return img;
                        })
                        .collect(Collectors.toList());
                existingNote.getImages().addAll(processedImages);
            }

            // Save updated note
            Note updatedNote = noteService.updateNote(existingNote);

            // Convert to DTO for response
            NoteDTO responseDto = convertToDto(updatedNote);

            return ResponseEntity.ok(responseDto);

        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid note format");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            logger.error("Error updating note: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating note: " + e.getMessage());
        }
    }


    // Add this helper method
    private NoteDTO convertToDto(Note note) {
        NoteDTO dto = new NoteDTO();
        dto.setId(note.getId());
        dto.setTitle(note.getTitle());
        dto.setContent(note.getContent());
        dto.setTags(note.getTags());
        dto.setImages(note.getImages().stream()
                .map(image -> new ImageDTO(image.getId(), baseUrl + "/image/" + image.getUrl()))
                .collect(Collectors.toList()));
        return dto;
    }



    //fetchImagesForNote
    @GetMapping("/images/{noteId}")
    public ResponseEntity<List<ImageDTO>> fetchImagesForNote(@PathVariable("noteId") int noteId) {
        try {
            System.out.println("Fetching images for note with ID: " + noteId);
            List<Image> images = imageService.getImagesByNoteId(noteId);
            List<ImageDTO> imageDTOs = images.stream().map(image -> {
                ImageDTO imageDTO = new ImageDTO();
                imageDTO.setId(image.getId());
                String imageName = image.getUrl();





                imageDTO.setUrl(baseUrl + "/image/" + imageName);
                return imageDTO;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(imageDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }





    @PutMapping(value = "/edited/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> editNote12(
            @PathVariable("id") int id,
            @RequestPart("note") String noteJson,
            @RequestPart(value = "images", required = false) MultipartFile[] newImages,
            @RequestHeader("Authorization") String authHeader) {

        try {
            // Validate authorization
            User user = validateAuthorization(authHeader);

            // Get existing note
            Note existingNote = noteService.getNoteById(id);
            if (existingNote == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
            }

            // pruefen ob der Benutzer die Notiz besitzt
            if (existingNote.getUser().getId() != user.getId()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You don't have permission to edit this note");
            }

            // Convert JSON zu NoteDTO
            ObjectMapper objectMapper = new ObjectMapper();
            NoteDTO noteUpdates = objectMapper.readValue(noteJson, NoteDTO.class);

            // aktualisiere Notizfelder
            existingNote.setTitle(noteUpdates.getTitle());
            existingNote.setContent(noteUpdates.getContent());
            existingNote.setTags(noteUpdates.getTags());

            // Handelt das Loeschen von Bildern, wenn sie in NoteDTO angegeben sind
            if (noteUpdates.getImagesToDelete() != null && !noteUpdates.getImagesToDelete().isEmpty()) {
                List<Image> imagesToDelete = existingNote.getImages().stream()
                        .filter(image -> noteUpdates.getImagesToDelete().contains(image.getId()))
                        .collect(Collectors.toList());

                for (Image image : imagesToDelete) {
                    // Delete image from storage
                    Files.deleteIfExists(Path.of("backend/src/main/resources/static/images/" + image.getUrl()));
                    // Remove image from note
                    existingNote.getImages().remove(image);
                    imageRepository.delete(image);
                }
            }

            // Handlt neue Bilder hinzufuegen
            if (newImages != null && newImages.length > 0) {
                for (MultipartFile file : newImages) {
                    Image newImage = processImage(file);
                    newImage.setNote(existingNote); // Set the note reference
                    existingNote.getImages().add(newImage);
                }
            }

            // speichere aktualisierte Notiz
            Note updatedNote = noteService.updateNote(existingNote);

            // konvertiere zu DTO fuer die Antwort
            NoteDTO responseDto = convertToDto(updatedNote);

            return ResponseEntity.ok(responseDto);

        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid note format");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing images: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating note: " + e.getMessage());
        }
    }

    //get note by id and his images if exists
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getNoteByIdWithImages(@PathVariable("id") int id) {
        Note note = noteService.getNoteById(id);
        if (note == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
        }

        NoteDTO noteDTO = convertToDto(note);
        return ResponseEntity.ok(noteDTO);
    }







    @PutMapping(value = "/editdeep/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> editNote(
            @PathVariable("id") int id,
            @RequestPart("note") String noteJson,
            @RequestPart(value = "images", required = false) MultipartFile[] newImages,
            @RequestHeader("Authorization") String authHeader) {

        try {
            // Validate authorization
            User user = validateAuthorization(authHeader);

            // Get existing note
            Note existingNote = noteService.getNoteById(id);
            if (existingNote == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found");
            }

            // Check if the user owns the note
            if (existingNote.getUser().getId() != user.getId()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You don't have permission to edit this note");
            }

            // Convert JSON to NoteDTO
            ObjectMapper objectMapper = new ObjectMapper();
            NoteDTO noteUpdates = objectMapper.readValue(noteJson, NoteDTO.class);

            // Update note fields
            existingNote.setTitle(noteUpdates.getTitle());
            existingNote.setContent(noteUpdates.getContent());
            existingNote.setTags(noteUpdates.getTags());

            // Handle image deletion (if imagesToDelete is provided in NoteDTO)
            if (noteUpdates.getImagesToDelete() != null && !noteUpdates.getImagesToDelete().isEmpty()) {
                List<Image> imagesToDelete = existingNote.getImages().stream()
                        .filter(image -> noteUpdates.getImagesToDelete().contains(image.getId()))
                        .collect(Collectors.toList());

                for (Image image : imagesToDelete) {
                    // Delete image from storage
                    Files.deleteIfExists(Path.of("backend/src/main/resources/static/images/" + image.getUrl()));
                    // Remove image from note
                    existingNote.getImages().remove(image);
                    imageRepository.delete(image);
                }
            }

            // Handle new image uploads
            if (newImages != null && newImages.length > 0) {
                for (MultipartFile file : newImages) {
                    if (!file.isEmpty()) {
                        Image newImage = processImage(file);
                        newImage.setNote(existingNote); // Set the note reference
                        existingNote.getImages().add(newImage);
                    }
                }
            }

            // Save updated note
            Note updatedNote = noteService.updateNote(existingNote);

            // Convert to DTO for response
            NoteDTO responseDto = convertToDto(updatedNote);

            return ResponseEntity.ok(responseDto);

        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid note format");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing images: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating note: " + e.getMessage());
        }
    }
}