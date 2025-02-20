package org.bootstmytool.backend.controller;

import org.bootstmytool.backend.dto.ImageDTO;
import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.service.ImageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * Der ImageController ist ein REST-Controller, der Endpunkte für den Zugriff auf Bilder bereitstellt.
 * Dieser Controller ermöglicht das Abrufen von Bildern, die mit bestimmten Notizen verknüpft sind,
 * sowie das direkte Abrufen von Bildern anhand ihres Namens.
 *
 * <p>Die Klasse verwendet den {@link ImageService}, um Bilddaten aus der Datenbank abzurufen,
 * und stellt diese über HTTP-Endpunkte zur Verfügung.</p>
 *
 * <p>Die Basis-URL für die Bild-URLs kann über die Eigenschaft {@code app.base-url} konfiguriert werden.
 * Der Standardwert ist {@code http://localhost:8080}.</p>
 *
 * @author Mohamed Cheikh
 * @version 1.0
 * @since 2025-01-01
 */
@RestController
@RequestMapping("/image")
public class ImageController {

    private final ImageService imageService;
    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

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
     * Gibt eine Liste von Bildern zurück, die mit einer bestimmten Notiz verknüpft sind.
     *
     * <p>Der Endpunkt erwartet die ID der Notiz als Pfadvariable und gibt eine Liste von {@link ImageDTO}-Objekten zurück,
     * die die URLs der Bilder enthalten. Falls keine Bilder gefunden werden, wird ein HTTP-404-Status zurückgegeben.</p>
     *
     * @param noteId Die ID der Notiz, für die die Bilder abgerufen werden sollen.
     * @return Eine {@link ResponseEntity}, die entweder eine Liste von {@link ImageDTO}-Objekten oder eine Fehlermeldung enthält.
     */
    @GetMapping("/note/{noteId}")
    public ResponseEntity<?> getImagesByNoteId(@PathVariable int noteId) {
        logger.info("Fetching images for note ID: {}", noteId);

        try {
            List<Image> images = imageService.getImagesByNoteId(noteId);
            if (images == null || images.isEmpty()) {
                logger.warn("No images found for note ID: {}", noteId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No images found for note ID: " + noteId);
            }

            List<ImageDTO> imageDTOs = images.stream()
                    .map(image -> new ImageDTO(baseUrl + "/image/" + image.getUrl()))
                    .toList();
            logger.info("Found {} images for note ID: {}", imageDTOs.size(), noteId);
            return ResponseEntity.ok(imageDTOs);
        } catch (Exception e) {
            logger.error("Error fetching images for note ID: {}", noteId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving images: " + e.getMessage());
        }
    }

    /**
     * Gibt ein Bild anhand seines Namens zurück.
     *
     * <p>Der Endpunkt erwartet den Namen des Bildes als Pfadvariable und gibt das Bild als {@link Resource} zurück.
     * Falls das Bild nicht gefunden wird, wird ein HTTP-404-Status zurückgegeben.</p>
     *
     * @param imageName Der Name des Bildes, das abgerufen werden soll.
     * @return Eine {@link ResponseEntity}, die entweder das Bild als {@link Resource} oder {@code null} enthält.
     * @throws RuntimeException Falls die URL des Bildes ungültig ist.
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



    //loeche ein Bild anhand seiner ID
    @DeleteMapping("/delete/{imageId}")
    public ResponseEntity<?> deleteImageById(@PathVariable int imageId) {
        System.out.println("Deleting image with ID: " + imageId);
        String imageUrl=imageService.getImageUrl(imageId);
        System.out.println("Deleting image with URL: " + imageUrl);
        try {
            imageService.deleteImageById(imageId);
            return ResponseEntity.ok().body("Image deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting image: {}", imageId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting image: " + e.getMessage());
        }
    }
}