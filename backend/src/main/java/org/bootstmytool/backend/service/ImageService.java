package org.bootstmytool.backend.service;

import jakarta.transaction.Transactional;
import org.bootstmytool.backend.dto.ImageDTO;
import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.repository.ImageRepository;
import org.bootstmytool.backend.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;


@Service
public class ImageService {

    //fuegt die NoteRepository und ImageRepository Instanzen hinzu
    private final NoteRepository noteRepository;
    private final ImageRepository imageRepository;


    //fuegt die ImageRepository und NoteRepository Instanzen hinzu
    @Autowired
    public ImageService(NoteRepository noteRepository, ImageRepository imageRepository) {
        this.noteRepository = noteRepository;
        this.imageRepository = imageRepository;
    }


    //speichert ein Image Objekt in der Datenbank
    public List<Image> getImagesByNoteId(int noteId) {
        return imageRepository.findByNoteId(noteId);
    }


//loeche ein Image Objekt aus der Datenbank
@Transactional
public boolean deleteImageById(int imgId) {
    Optional<Image> imageOpt = imageRepository.findById(imgId);

    if (imageOpt.isPresent()) {
        Image image = imageOpt.get();
        String imagePath = "backend/src/main/resources/static/images/" + image.getUrl(); // Update path

        // Delete file from server
        File file = new File(imagePath);
        if (file.exists()) {
            if (file.delete()) {
            } else {
                throw new RuntimeException("Failed to delete image file");
            }
        } else {

        }


        // Remove reference from associated Notes
        List<Note> notes = noteRepository.findByImagesContaining((image));
        for (Note note : notes) {
            note.getImages().remove(image);
            noteRepository.save(note);  // Save the updated Note entity
        }


        // Delete entry from database
        imageRepository.deleteById(imgId);

        return true;
    } else {
        return false;
    }

}


    @Value("${image.upload.dir}")
    private String imageUploadDir;
//speichert ein Image Objekt in der Datenbank
private Image processImage(MultipartFile file) {
    try {
        // Create directory if it doesn't exist
        Path imagePath = Path.of(imageUploadDir);
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
        //logger.warn("Error processing image {}: {}", file.getOriginalFilename(), e.getMessage());
        throw new RuntimeException("Error processing image.");
    }
}


    //gibt Resource Objekt zurueck
    public Resource getImage(int imageId) {
        Image image = imageRepository.findById(imageId).orElse(null);
        if (image == null) {
            return null;
        }
        try {
            return new UrlResource("file:" + image.getUrl());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }

    public String getImageUrl(int imageId) {
        Image image = imageRepository.findById(imageId).orElse(null);
        if (image == null) {
            return null;
        }
        return image.getUrl();
    }


    public Image uploadImage(int noteId, MultipartFile file) {
        // Save the image and get the relative path


        // Create and save Image entity

     // Find the Note entity
        Note note = noteRepository.findById(noteId).orElseThrow(() -> new RuntimeException("Note not found"));
        Image image = processImage(file);
       // Associate image with note
        note.getImages().add(image);
        image.setNote(note);
        noteRepository.save(note);

        return image;
    }

}
