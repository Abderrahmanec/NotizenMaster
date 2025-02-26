package org.bootstmytool.backend.repository;

import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * Das Repository für die Note-Entität. Es stellt die grundlegenden CRUD-Operationen
 * zur Verfügung und enthält zusätzliche Methoden zum Abrufen von Notizen eines bestimmten Benutzers.
 * Diese Schnittstelle erweitert JpaRepository, um eine Verbindung zur Datenbank herzustellen.
 */
public interface NoteRepository extends JpaRepository<Note, Integer> {

    /**
     * Findet eine Note anhand ihrer ID.
     *
     * @param noteId Die ID der Note
     * @return Eine Option mit der Note, falls gefunden
     */
    Optional<Note> findById(int noteId); // Findet eine Note anhand ihrer ID

    List<Note> findByUserId(int id); // Findet alle Notizen eines bestimmten Benutzers

    Optional<Note> getNoteById(int noteId); // Findet eine Note anhand ihrer ID

    List<Note> findByImagesContaining(Image image); // Findet alle Notizen, die ein bestimmtes Bild enthalten

}

