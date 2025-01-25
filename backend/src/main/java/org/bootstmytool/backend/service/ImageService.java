package org.bootstmytool.notizenbackend.services;

import org.bootstmytool.notizenbackend.model.Image;
import org.bootstmytool.notizenbackend.model.Note;
import org.bootstmytool.notizenbackend.repository.ImageRepository;
import org.bootstmytool.notizenbackend.repository.NoteRepository;
import org.bootstmytool.notizenbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService {


    private final NoteRepository noteRepository;
    private final ImageRepository imageRepository;



    @Autowired
    public ImageService(NoteRepository noteRepository, ImageRepository imageRepository) {
        this.noteRepository = noteRepository;
        this.imageRepository = imageRepository;
    }

    // Add image to a specific note
    public void addImageToNote(int noteId, Image image) {
        // Fetch the note by ID
        Note note = noteRepository.findById(noteId).orElseThrow(() -> new RuntimeException("Note not found"));

        // Associate the note with the image
        image.setNote(note);

        // Save the image (cascade will save it with the note automatically)
        imageRepository.save(image);
    }

    public List<Image> getImagesByNoteId(int noteId) {
        return imageRepository.findByNoteId(noteId);
    }
}
