package org.bootstmytool.backend.repository;

import org.bootstmytool.backend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * Das Repository für die Image-Entität. Diese Schnittstelle erweitert JpaRepository,
 * um grundlegende CRUD-Operationen für die Bilder zu ermöglichen und benutzerdefinierte
 * Abfragen durchzuführen.
 */
public interface ImageRepository extends JpaRepository<Image, Integer> {

    //Findet alle Bilder, die mit einer bestimmten Notiz verknuepft sind
    List<Image> findByNoteId(int noteId);

    //Findet ein Bild anhand der Bild-ID
    Optional<Image> findById(int imageId);

}