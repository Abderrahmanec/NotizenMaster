package org.bootstmytool.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Die User-Klasse stellt einen Benutzer im System dar. Sie enthält Informationen
 * wie den Benutzernamen, das Passwort und die Notizen, die der Benutzer erstellt hat.
 * Die Klasse implementiert die Schnittstelle für die Autorisierungen und Rollenzuweisungen.
 */
@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Die eindeutige ID des Benutzers

    @Column(unique = true, nullable = false)
    private String username; // Der Benutzername des Benutzers

    @Column(nullable = false)
    private String password; // Das Passwort des Benutzers

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Note> notes; // Eine Liste der Notizen, die der Benutzer erstellt hat

    /**
     * Setzt die ID des Benutzers.
     *
     * @param id Die ID, die gesetzt werden soll
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Setzt den Benutzernamen des Benutzers.
     *
     * @param username Der Benutzername, der gesetzt werden soll
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Setzt das Passwort des Benutzers.
     *
     * @param password Das Passwort, das gesetzt werden soll
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Setzt die Liste der Notizen, die der Benutzer erstellt hat.
     *
     * @param notes Eine Liste von Notizen
     */
    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }

    /**
     * Gibt die ID des Benutzers zurück.
     *
     * @return Die ID des Benutzers
     */
    public long getId() {
        return id;
    }

    /**
     * Gibt den Benutzernamen des Benutzers zurück.
     *
     * @return Der Benutzername des Benutzers
     */
    public String getUsername() {
        return username;
    }

    /**
     * Gibt das Passwort des Benutzers zurück.
     *
     * @return Das Passwort des Benutzers
     */
    public String getPassword() {
        return password;
    }

    /**
     * Gibt die Liste der Notizen zurück, die der Benutzer erstellt hat.
     *
     * @return Eine Liste von Notizen
     */
    public List<Note> getNotes() {
        return notes;
    }

    /**
     * Gibt die Berechtigungen (Rollen) des Benutzers zurück.
     * Der Benutzer wird hier als "ROLE_USER" betrachtet.
     *
     * @return Eine Sammlung von Autorisierungen (Rollen)
     */
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Hier wird angenommen, dass jeder Benutzer die Rolle "ROLE_USER" hat
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }
}
