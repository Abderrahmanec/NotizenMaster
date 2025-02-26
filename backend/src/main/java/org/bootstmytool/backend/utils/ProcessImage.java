package org.bootstmytool.backend.utils;

import org.bootstmytool.backend.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * Klasse, die die Verarbeitung von Bildern behandelt.
 */

public class ProcessImage {


    /**
     * Processes behandelte das Bild und speichert es im Dateisystem.
     */
    public static Image processImage(MultipartFile file) {
        try {
            // erstelle einen Ordner für die Bilder, wenn er noch nicht existiert
            Path imagePath = Path.of("backend/src/main/resources/static/images/");
            if (!Files.exists(imagePath)) {
                Files.createDirectories(imagePath);
            }

            //erstelle einen eindeutigen Bildnamen
            String imageName = System.currentTimeMillis() + "_" + Objects.requireNonNull(file.getOriginalFilename()).replaceAll("[^a-zA-Z0-9._-]", "_");
            Path targetPath = imagePath.resolve(imageName);

            // speichere das Bild im Dateisystem
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // erstelle ein Image-Objekt und setze die Bilddaten
            Image image = new Image();
            image.setData(file.getBytes());
            image.setUrl(imageName);  // Store only the image name
            return image;
        } catch (IOException e) {

            throw new RuntimeException("Fehler beim Verarbeiten des Bildes: " + e.getMessage());
        }


    }


}
