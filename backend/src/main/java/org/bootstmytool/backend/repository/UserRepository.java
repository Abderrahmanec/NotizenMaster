package org.bootstmytool.backend.repository;

import org.bootstmytool.backend.model.User; // Importiert das User-Modell
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * Das Repository für die User-Entität. Diese Schnittstelle erweitert JpaRepository,
 * um grundlegende CRUD-Operationen für die Benutzer zu ermöglichen und benutzerdefinierte
 * Abfragen durchzuführen.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * Findet einen Benutzer anhand des Benutzernamens.
     *
     * @param email Der Benutzername des gesuchten Benutzers
     * @return Ein Optional mit dem Benutzer, falls gefunden
     */
    Optional<User> findByEmail(String email);


}
