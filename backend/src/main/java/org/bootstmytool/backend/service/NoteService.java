package org.bootstmytool.backend.service;

import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NoteService {
    
    @Autowired
    private NoteRepository noteRepository;

    /**
     * Erstellt eine neue Notiz und speichert sie in der Datenbank.
     * 
     * @param note die zu speichernde Notiz.
     * @return die gespeicherte Notiz.
     */
    public Note createNote(Note note) {
        return noteRepository.save(note);
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
}
