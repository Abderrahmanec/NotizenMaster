package org.bootstmytool.backend.repository;

import org.bootstmytool.backend.model.User; // Importiert das User-Modell
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Das Repository für die User-Entität. Diese Schnittstelle erweitert JpaRepository,
 * um grundlegende CRUD-Operationen für die Benutzer zu ermöglichen und benutzerdefinierte
 * Abfragen durchzuführen.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * Findet einen Benutzer anhand des Benutzernamens.
     *
     * @param username Der Benutzername des gesuchten Benutzers
     * @return Ein Optional mit dem Benutzer, falls gefunden
     */
    Optional<User> findByUsername(String username);

    /**
     * Findet einen Benutzer anhand des Benutzernamens und Passworts.
     *
     * @param username Der Benutzername des gesuchten Benutzers
     * @param password Das Passwort des gesuchten Benutzers
     * @return Ein Optional mit dem Benutzer, falls Benutzername und Passwort übereinstimmen
     */
    Optional<User> findByUsernameAndPassword(String username, String password);

    /**
     * Überprüft, ob der Benutzername bereits in der Datenbank existiert.
     *
     * @param username Der Benutzername, der überprüft werden soll
     * @return Ein Optional mit dem Benutzer, falls der Benutzername existiert
     */
    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> checkIfUsernameExists(@Param("username") String username);
}
