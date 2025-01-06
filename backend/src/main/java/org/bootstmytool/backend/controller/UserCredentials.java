package org.bootstmytool.backend.controller;

/**
 * Die Klasse UserCredentials speichert die Anmeldeinformationen eines Benutzers,
 * einschließlich des Benutzernamens und des Passworts.
 * Diese Klasse wird in der Regel verwendet, um Benutzerdaten während der Registrierung oder beim Login zu verarbeiten.
 */
public class UserCredentials {

    private String username; // Der Benutzername des Benutzers
    private String password; // Das Passwort des Benutzers

    /**
     * Gibt den Benutzernamen des Benutzers zurück.
     *
     * @return Der Benutzername
     */
    public String getUsername() {
        return username;
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
     * Gibt das Passwort des Benutzers zurück.
     *
     * @return Das Passwort
     */
    public String getPassword() {
        return password;
    }

    /**
     * Setzt das Passwort des Benutzers.
     *
     * @param password Das Passwort, das gesetzt werden soll
     */
    public void setPassword(String password) {
        this.password = password;
    }
}
