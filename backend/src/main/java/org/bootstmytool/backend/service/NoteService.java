package org.bootstmytool.backend.service;

import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.repository.ImageRepository;
import org.bootstmytool.backend.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final ImageRepository imageRepository;

    /**
     * Erstellt eine neue Instanz von NoteService.
     *
     * @param noteRepository das NoteRepository, das verwendet werden soll.
     * @param imageRepository das ImageRepository, das verwendet werden soll.
     */
    @Autowired
    public NoteService(NoteRepository noteRepository, ImageRepository imageRepository) {
        this.noteRepository = noteRepository;
        this.imageRepository = imageRepository;
    }

    /**
     * Erstellt eine neue Notiz und speichert sie in der Datenbank.
     * 
     * @param note die zu speichernde Notiz.
     * @return die gespeicherte Notiz.
     */
    @Transactional
    public Note createNote(Note note) {
        // Save the note first
        Note savedNote = noteRepository.save(note);

        // Ensure images are associated with the saved note
        if (note.getImages() != null) {
            for (Image image : note.getImages()) {
                image.setNote(savedNote);  // Associate image with the saved note
                imageRepository.save(image);  // Save the image with the note_id
            }
        }

        return savedNote;
    }
    /**
     * Holt eine Notiz aus der Datenbank basierend auf der angegebenen ID.
     * 
     * @param id die ID der Notiz.
     * @return die Notiz, die der angegebenen ID entspricht, oder null, wenn keine Notiz gefunden wird.
     */
    public Note getNoteById(int id) {
        return noteRepository.findById(id).orElse(null);
    }

    public List<Note> getNotesByUserId(int id) {
        return noteRepository.findByUserId(id);
    }
}
