package org.bootstmytool.backend.dto;

import lombok.Data;

/**
 * Die UserDTO (Data Transfer Object) Klasse wird verwendet, um Benutzerdaten wie
 * den Benutzernamen und das Passwort zwischen den verschiedenen Schichten der
 * Anwendung zu übertragen.
 */
@Data
public class UserDTO {
    private String username; // Der Benutzername des Benutzers
    private String password; // Das Passwort des Benutzers

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
}
