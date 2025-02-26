package org.bootstmytool.backend.controller;

import org.bootstmytool.backend.dto.ImageDTO;
import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

/**
 * @author Mohamed Cheikh
 * @version 1.0
 * @Date: 2025-03-27
 * <p>
 * Der ImageController ist ein REST-Controller, der Endpunkte für den Zugriff auf Bilder bereitstellt.
 * Dieser Controller ermöglicht das Abrufen von Bildern, die mit bestimmten Notizen verknüpft sind,
 * sowie das direkte Abrufen von Bildern anhand ihres Namens.
 *
 * <p>Die Klasse verwendet den {@link ImageService}, um Bilddaten aus der Datenbank abzurufen,
 * und stellt diese über HTTP-Endpunkte zur Verfügung.</p>
 *
 * <p>Die Basis-URL für die Bild-URLs kann über die Eigenschaft {@code app.base-url} konfiguriert werden.
 * Der Standardwert ist {@code http://localhost:8080}.</p>
 * </p>
 */
@RestController
@RequestMapping("/image")
public class ImageController {

    private final ImageService imageService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * Konstruktor für den ImageController.
     *
     * @param imageService Der Service, der für den Zugriff auf Bilddaten verwendet wird.
     */
    @Autowired
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    /**
     * <p>
     * Gibt eine Liste von Bildern zurück, die mit einer bestimmten Notiz verknüpft sind.
     *
     * <p>Der Endpunkt erwartet die ID der Notiz als Pfadvariable und gibt eine Liste von {@link ImageDTO}-Objekten zurück,
     * die die URLs der Bilder enthalten. Falls keine Bilder gefunden werden, wird ein HTTP-404-Status zurückgegeben.</p>
     *
     * @param noteId Die ID der Notiz, für die die Bilder abgerufen werden sollen.
     * @return Eine {@link ResponseEntity}, die entweder eine Liste von {@link ImageDTO}-Objekten oder eine Fehlermeldung enthält.
     * </p>
     */
    @GetMapping("/note/{noteId}")
    public ResponseEntity<?> getImagesByNoteId(@PathVariable int noteId) {

        try {
            List<Image> images = imageService.getImagesByNoteId(noteId);
            if (images == null || images.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notiz hat keine Bilder: " + noteId);
            }

            List<ImageDTO> imageDTOs = images.stream()
                    .map(image -> new ImageDTO(image.getId(), baseUrl + "/image/" + image.getUrl()))
                    .toList();

            return ResponseEntity.ok(imageDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fehler : " + e.getMessage());
        }
    }

    /**
     * <p>
     * Gibt ein Bild anhand seines Namens zurück.
     *
     * <p>Der Endpunkt erwartet den Namen des Bildes als Pfadvariable und gibt das Bild als {@link Resource} zurück.
     * Falls das Bild nicht gefunden wird, wird ein HTTP-404-Status zurückgegeben.</p>
     *
     * @param imageName Der Name des Bildes, das abgerufen werden soll.
     * @return Eine {@link ResponseEntity}, die entweder das Bild als {@link Resource} oder {@code null} enthält.
     * @throws RuntimeException Falls die URL des Bildes ungültig ist.
     * </p>
     */
    @GetMapping("/{imageName}")
    public ResponseEntity<?> getImage(@PathVariable String imageName) {
        try {
            Path path = Paths.get("backend/src/main/resources/static/images/" + imageName);
            Resource resource = new UrlResource(path.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok().body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error loading image: " + imageName, e);
        }
    }


    /**
     * <p>
     * Löscht ein Bild anhand seiner ID.
     *
     * <p>Der Endpunkt erwartet die ID des Bildes als Pfadvariable und löscht das Bild aus der Datenbank.
     * Falls das Bild nicht gefunden wird, wird ein HTTP-404-Status zurückgegeben.</p>
     *
     * @param imageId Die ID des Bildes, das gelöscht werden soll.
     * @return Eine {@link ResponseEntity}, die entweder eine Erfolgsmeldung oder eine Fehlermeldung enthält.
     * </p>
     */
    @DeleteMapping("/delete/{imageId}")
    public ResponseEntity<?> deleteImageById(@PathVariable int imageId) {
        String imageUrl = imageService.getImageUrl(imageId);
        try {
            if (imageUrl == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Bild nicht gefunden"));
            }

            imageService.deleteImageById(imageId);
            return ResponseEntity.ok(Map.of("message", "Image deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting image: " + e.getMessage());
        }
    }


    /**
     * <p>
     * Fügt ein Bild zu einer Notiz hinzu.
     *
     * <p>Der Endpunkt erwartet die ID der Notiz als Pfadvariable und das Bild als {@link MultipartFile}.
     * Das Bild wird in die Datenbank geladen und mit der Notiz verknüpft.
     * Falls das Bild nicht hochgeladen werden kann, wird ein HTTP-400-Status zurückgegeben.</p>
     *
     * @param noteId Die ID der Notiz, zu der das Bild hinzugefügt werden soll.
     * @param image  Das Bild, das hinzugefügt werden soll.
     * @return Eine {@link ResponseEntity}, die entweder das Bild als {@link Image} oder {@code null} enthält.
     * </p>
 */
    @PostMapping(value = "/{noteId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Image> addImageToNote(
            @PathVariable("noteId") int noteId,
            @RequestParam("image") MultipartFile image
    ) {

        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        try {
            // Laden des Bildes in die Datenbank
            Image img = imageService.uploadImage(noteId, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(img);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}