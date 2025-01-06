package org.bootstmytool.backend.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController ist der Controller, der für die Authentifizierung und Registrierung der Benutzer verantwortlich ist.
 * Es enthält Endpunkte für das Login und die Registrierung von Benutzern.
 */
@RestController
@CrossOrigin(origins = "*") // Erlaubt explizit alle Ursprünge
public class AuthController {

    @Autowired
    private org.bootstmytool.backend.service.AuthService authService; // Authentifizierungsdienst

    @Autowired
    private org.bootstmytool.backend.service.JwtService jwtService; // JWT-Dienst zum Generieren von Token

    /**
     * Endpunkt für die Anmeldung eines Benutzers.
     * Überprüft die Benutzeranmeldeinformationen und gibt ein JWT-Token zurück, wenn die Anmeldung erfolgreich ist.
     *
     * @param request Die Anmeldedaten des Benutzers (Benutzername und Passwort)
     * @return Eine ResponseEntity mit dem Ergebnis der Anmeldung
     */
    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest request) {
        System.out.println("Empfangene Login-Anfrage für Benutzername: " + request.getUsername());

        // Authentifizierung des Benutzers
        boolean authenticated = authService.authenticate(request.getUsername(), request.getPassword());
        System.out.println("Authentifizierungsstatus für Benutzer " + request.getUsername() + ": " + authenticated);

        if (authenticated) {
            // Generiere JWT-Token
            String token = jwtService.generateToken(request.getUsername());
            System.out.println("Generiertes Token für Benutzer " + request.getUsername() + ": " + token);
            return ResponseEntity.ok(new LoginResponse(true, "Login erfolgreich", token));
        } else {
            return ResponseEntity.status(401).body(new LoginResponse(false, "Ungültige Anmeldedaten", null));
        }
    }

    /**
     * Endpunkt für die Registrierung eines neuen Benutzers.
     * Überprüft, ob der Benutzername bereits existiert und registriert den Benutzer, falls nicht.
     *
     * @param credentials Die Anmeldedaten des neuen Benutzers
     * @return Eine ResponseEntity mit dem Ergebnis der Registrierung
     */
    @PostMapping("/api/auth/register")
    public ResponseEntity<String> register(@RequestBody UserCredentials credentials) {
        // Details der Registrierungsanfrage ausgeben
        System.out.println("Empfangene Registrierungsanfrage:");
        System.out.println("Benutzername: " + credentials.getUsername());
        System.out.println("Passwort: " + credentials.getPassword());

        // Benutzerregistrierung
        boolean registrationSuccess = authService.registerUser(credentials.getUsername(), credentials.getPassword());
        if (registrationSuccess) {
            return ResponseEntity.ok("Registrierung erfolgreich");
        } else {
            return ResponseEntity.status(400).body("Benutzername existiert bereits");
        }
    }

    /**
     * Benutzerlogin-Datenmodell.
     * Enthält den Benutzernamen und das Passwort für den Login-Vorgang.
     */
    public static class UserLoginRequest {
        private String username; // Benutzername
        private String password; // Passwort

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    /**
     * Antwortmodell für das Login.
     * Enthält den Status der Anmeldung (erfolgreich oder nicht), eine Nachricht und das JWT-Token.
     */
    public static class LoginResponse {
        private boolean success; // Erfolgsstatus der Anmeldung
        private String message;  // Nachricht zur Anmeldung
        private String token;    // JWT-Token

        public LoginResponse(boolean success, String message, String token) {
            this.success = success;
            this.message = message;
            this.token = token;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }

    /**
     * Benutzeranmeldedatenmodell.
     * Enthält den Benutzernamen und das Passwort für die Registrierung und Authentifizierung.
     */
    public static class UserCredentials {
        private String username; // Benutzername
        private String password; // Passwort

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
