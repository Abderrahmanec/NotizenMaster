package org.bootstmytool.backend.repository;

import org.bootstmytool.backend.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Das Repository für die Note-Entität. Es stellt die grundlegenden CRUD-Operationen
 * zur Verfügung und enthält zusätzliche Methoden zum Abrufen von Notizen eines bestimmten Benutzers.
 * Diese Schnittstelle erweitert JpaRepository, um eine Verbindung zur Datenbank herzustellen.
 */
public interface NoteRepository extends JpaRepository<Note, Integer> { // ID ist vom Typ Integer, nicht Long

    /**
     * Findet alle Notizen eines bestimmten Benutzers anhand der Benutzer-ID.
     *
     * @param userId Die ID des Benutzers
     * @return Eine Liste von Notizen des Benutzers
     */
    List<Note> findAllByUserId(int userId); // Findet alle Notizen eines Benutzers

    /**
     * Findet eine Note anhand ihrer ID.
     *
     * @param noteId Die ID der Note
     * @return Eine Option mit der Note, falls gefunden
     */
    Optional<Note> findById(int noteId); // Findet eine Note anhand ihrer ID
}

