package org.bootstmytool.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @Author Mohamed Cheikh
 * @version 1.0
 * @Date: 2025-03-27
 * Die User-Klasse stellt einen Benutzer im System dar. Sie enthält Informationen
 * wie den Benutzernamen, das Passwort und die Notizen, die der Benutzer erstellt hat.
 * Die Klasse implementiert die Schnittstelle für die Autorisierungen und Rollenzuweisungen.
 */
@Setter
@Entity
@Table(name = "users")
public class User {

    /**
     * -- SETTER --
     *  Setzt die ID des Benutzers.
     *
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Die eindeutige ID des Benutzers
    /**
     * -- GETTER --
     * Gibt den Benutzernamen des Benutzers zurück.
     *
     * -- SETTER --
     *  Setzt den Benutzernamen des Benutzers.
     *

     */
    @Getter
    @Column(unique = true, nullable = false)
    private String email; // die Email des Benutzers

    /**
     * -- GETTER --
     * Gibt das Passwort des Benutzers zurück.
     *
     *
     * -- SETTER --
     *  Setzt das Passwort des Benutzers.
     *
     @return Das Passwort des Benutzers
      * @param password Das Passwort, das gesetzt werden soll
     */
    @Getter
    @Column(nullable = false)
    private String password; // Das Passwort des Benutzers

    /**
     * -- GETTER --
     * Gibt die Liste der Notizen zurück, die der Benutzer erstellt hat.
     * -- SETTER --
     *  Setzt die Liste der Notizen, die der Benutzer erstellt hat.
     *
     * @param notes Eine Liste von Notizen

     */
    @Getter
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Note> notes; // Eine Liste der Notizen, die der Benutzer erstellt hat

    @Getter
    private int nameLength;

    /**
     * Gibt die ID des Benutzers zurück.
     *
     * @return Die ID des Benutzers
     */
    public long getId() {
        return id;
    }


}
