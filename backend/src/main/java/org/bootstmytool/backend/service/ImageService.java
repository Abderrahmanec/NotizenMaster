package org.bootstmytool.backend.service;

import jakarta.transaction.Transactional;
import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.repository.ImageRepository;
import org.bootstmytool.backend.repository.NoteRepository;
import org.bootstmytool.backend.utils.ProcessImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.Optional;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * ImageService ist verantwortlich für die Verarbeitung von Bildern, die mit Notizen verknüpft sind.
 */

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


    /**
     * @param imgId
     * @return Diese Methode loescht ein Bild aus der Datenbank und vom Server.
     */
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


            // Loesche das Image Objekt aus der Liste der Images in der Note
            List<Note> notes = noteRepository.findByImagesContaining((image));
            for (Note note : notes) {
                note.getImages().remove(image);
                noteRepository.save(note);  // Save the updated Note entity
            }

            // loesche das Image Objekt aus der Datenbank
            imageRepository.deleteById(imgId);

            return true;
        } else {
            return false;
        }

    }


    /**
     * @param imageId Diese Methode gibt die URL des Bildes zurück, das mit der angegebenen ID verknüpft ist.
     * @return
     */

    public String getImageUrl(int imageId) {
        Image image = imageRepository.findById(imageId).orElse(null);
        if (image == null) {
            return null;
        }
        return image.getUrl();
    }


    /**
     * @param noteId
     * @param file
     * @return Diese Methode lädt ein Bild hoch und speichert es in der Datenbank.
     */
    public Image uploadImage(int noteId, MultipartFile file) {
        // Finde Note
        Note note = noteRepository.findById(noteId).orElseThrow(() -> new RuntimeException("Note not found"));
        Image image = ProcessImage.processImage(file);//.processImage(file);
        // Speichere Image in Datenbank
        note.getImages().add(image);
        image.setNote(note);
        noteRepository.save(note);

        return image;
    }

}
