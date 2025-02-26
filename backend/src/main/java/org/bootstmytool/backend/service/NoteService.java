package org.bootstmytool.backend.service;

import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.repository.ImageRepository;
import org.bootstmytool.backend.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * Service-Klasse für die Verarbeitung von Notizen.
 */

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final ImageRepository imageRepository;

    /**
     * Erstellt eine neue Instanz von NoteService.
     *
     * @param noteRepository  das NoteRepository, das verwendet werden soll.
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
        // Speichern der Notiz in der Datenbank
        Note savedNote = noteRepository.save(note);

        //Gewaehrleisten, dass die Bilder der Notiz in der Datenbank gespeichert werden
        if (note.getImages() != null) {
            for (Image image : note.getImages()) {
                image.setNote(savedNote);
                imageRepository.save(image);
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
        return noteRepository.getNoteById(id).orElse(null);
    }

    /**
     * Holt alle Notizen aus der Datenbank.
     *
     * @return eine Liste von Notizen.
     */
    public List<Note> getNotesByUserId(int id) {
        return noteRepository.findByUserId(id);
    }


    /**
     * Löscht eine Notiz aus der Datenbank basierend auf der angegebenen ID.
     *
     * @param id die ID der Notiz.
     * @return eine Bestätigungsmeldung, dass die Notiz gelöscht wurde, oder eine Meldung, dass die Notiz nicht gefunden wurde.
     */
    public String deleteNoteById(int id) {
        Note existingNote = noteRepository.findById(id).orElse(null);
        if (existingNote != null) {
            noteRepository.delete(existingNote);
            return "Notiz gelöscht!";
        }
        return "Notiz nicht gefunden!";
    }

    /**
     * Bearbeitet eine Notiz basierend auf der angegebenen ID.
     *
     * @param id   die ID der Notiz.
     * @param note die aktualisierte Notiz.
     * @return die aktualisierte Notiz.
     */
    public Note editNoteById(int id, Note note) {
        Note existingNote = noteRepository.findById(id).orElse(null);
        if (existingNote != null) {
            existingNote.setTitle(note.getTitle());
            existingNote.setContent(note.getContent());
            return noteRepository.save(existingNote);
        }
        return null;
    }


    /**
     * Aktualisiert eine Notiz in der Datenbank.
     *
     * @param existingNote die zu aktualisierende Notiz.
     * @return die aktualisierte Notiz.
     */
    public Note updateNote(Note existingNote) {
        return noteRepository.save(existingNote);
    }

    public void save(Note note) {
        noteRepository.save(note);
    }
}
