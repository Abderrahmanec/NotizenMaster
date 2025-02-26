package org.bootstmytool.backend.service;

import org.bootstmytool.backend.model.User;
import org.bootstmytool.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * AuthService ist verantwortlich für die Benutzer-Authentifizierung und Registrierung.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Konstruktor zur Initialisierung des AuthService mit den erforderlichen Abhängigkeiten.
     *
     * @param userRepository  Repository zum Interagieren mit den Benutzerdaten.
     * @param passwordEncoder Encoder zum sicheren Hashen von Passwörtern.
     */
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authentifiziert einen Benutzer, indem die angegebenen Anmeldeinformationen mit der Datenbank verglichen werden.
     *
     * @param username der Benutzername des Benutzers, der sich anmelden möchte.
     * @param password das Passwort des Benutzers, der sich anmelden möchte.
     * @return true, wenn die Anmeldeinformationen korrekt sind, andernfalls false.
     */
    public boolean authenticate(String username, String password) {

        // Benutzer aus der Datenbank basierend auf dem Benutzernamen abrufen
        User user = userRepository.findByEmail(username).orElse(null);

        if (user != null) {
            // Überprüfen, ob das angegebene Passwort mit dem gespeicherten gehashten Passwort übereinstimmt
            return passwordEncoder.matches(password, user.getPassword());
        }

        // Gibt false zurück, wenn der Benutzer nicht existiert oder das Passwort nicht übereinstimmt
        return false;
    }

    /**
     * Registriert einen neuen Benutzer, indem dessen Anmeldeinformationen in der Datenbank gespeichert werden.
     *
     * @param username der Benutzername des neuen Benutzers.
     * @param password das Passwort des neuen Benutzers.
     * @return true, wenn der Benutzer erfolgreich registriert wurde, andernfalls false.
     */
    public boolean registerUser(String username, String password) {

        // Überprüfen, ob der Benutzername bereits in der Datenbank existiert
        Optional<User> existingUser = userRepository.findByEmail(username);
        if (existingUser.isPresent()) {
            return false; // Benutzername existiert bereits, Registrierung fehlgeschlagen
        }

        // Erstellen eines neuen User-Objekts mit dem angegebenen Benutzernamen und dem gehashten Passwort
        User newUser = new User();
        newUser.setEmail(username);
        newUser.setPassword(passwordEncoder.encode(password));  // Passwort vor dem Speichern hashen

        // Versuchen, den neuen Benutzer in der Datenbank zu speichern
        try {
            int nameLength = newUser.getEmail().split("@")[0].length(); // Länge des Namens berechnen
            newUser.setNameLength(nameLength);
            userRepository.save(newUser);
            return true; // Registrierung war erfolgreich
        } catch (Exception e) {
            // Ausnahme protokollieren und false zurückgeben, wenn ein Fehler auftritt
              return false;
        }
    }
}
