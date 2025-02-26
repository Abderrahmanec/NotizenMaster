package org.bootstmytool.backend.controller;


import lombok.Getter;
import lombok.Setter;
import org.bootstmytool.backend.model.User;
import org.bootstmytool.backend.repository.UserRepository;
import org.bootstmytool.backend.security.CustomUserDetailsService;
import org.bootstmytool.backend.service.AuthService;
import org.bootstmytool.backend.service.JwtService;
import org.bootstmytool.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * @Author: Mohamed Cheikh
 * @Version: 1.0
 * @Date: 2025-03-27
 * <p>
 * AuthController ist der Controller, der für die Authentifizierung und Registrierung der Benutzer verantwortlich ist.
 * Es enthält Endpunkte für das Login und die Registrierung von Benutzern.
 * Auch die Verifizierung des Benutzers und das Zurücksetzen des Passworts sind in diesem Controller enthalten.
 * </p>
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Erlaubt explizit alle Urspruenge
public class AuthController {

    @Autowired
    private AuthService authService; // Authentifizierungsdienst

    @Autowired
    private JwtService jwtService; // JWT-Dienst zum Generieren von Token
    @Autowired
    private UserRepository userRepository; // Benutzerrepository

    @Autowired
    private CustomUserDetailsService userDetailsService; // Benutzerdetailservice

    @Autowired
    UserService userService;


    /**
     * Endpunkt für die Registrierung eines neuen Benutzers.
     * Überprüft, ob die E-Mail bereits existiert und registriert den Benutzer, falls nicht.
     *
     * @param credentials Die Anmeldedaten des neuen Benutzers
     * @return Eine ResponseEntity mit dem Ergebnis der Registrierung
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserCredentials credentials) {

        // Benutzerregistrierung
        boolean registrationSuccess = authService.registerUser(credentials.getEmail(), credentials.getPassword());
        if (registrationSuccess) {
            return ResponseEntity.ok("Registrierung erfolgreich");
        } else {
            return ResponseEntity.status(400).body("Benutzername existiert bereits");
        }
    }


    /**
     * Endpunkt für die Anmeldung eines Benutzers.
     * Überprüft die Benutzeranmeldeinformationen und gibt ein JWT-Token zurück, wenn die Anmeldung erfolgreich ist.
     *
     * @param request Die Anmeldedaten des Benutzers (Email und Passwort)
     * @return Eine ResponseEntity mit dem Ergebnis der Anmeldung
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest request) {

        // Authentifizierung des Benutzers
        boolean authenticated = authService.authenticate(request.getEmail(), request.getPassword());

        if (authenticated) {
            // Generiere JWT-Token
            String token = jwtService.generateToken(request.getEmail());
            return ResponseEntity.ok(new LoginResponse(true, "Login erfolgreich", token));
        } else {
            return ResponseEntity.status(401).body(new LoginResponse(false, "Ungültige Anmeldedaten", null));
        }
    }


    /**
     * Endpunkt für die Verifizierung eines Benutzers.
     * Überprüft, ob der Benutzername und die Länge des Benutzernamens übereinstimmen.
     * Die Länge ist in der Datenbank gespeichert und wird mit der Länge des Benutzernamens verglichen.
     * Wenn die Längen übereinstimmen, wird ein JWT-Token zurückgegeben.
     *
     * @param body Die Anfrage mit den Benutzerdaten
     * @return Eine ResponseEntity mit dem Ergebnis der Verifizierung
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody Map<String, Object> body) {
        try {
            String email = (String) body.get("email");
            int nameLength = Integer.parseInt(body.get("nameLength").toString());

            Optional<User> user = userRepository.findByEmail(email);

            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Benutzer nicht gefunden");
            }

            if (nameLength != user.get().getNameLength()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Verifikation fehlgeschlagen");
            }

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Ungültiges Zahlenformat für nameLength");
        } catch (NullPointerException e) {
            return ResponseEntity.badRequest().body("Erforderliche Felder fehlen");
        }

        //Erfolgreiche Verifizierung
        UserLoginRequest loginRequest = new UserLoginRequest();
        loginRequest.setEmail((String) body.get("email"));
        loginRequest.setPassword((String) body.get("password"));
        String email = (String) body.get("email");

        // Generiere JWT-Token
        String token = jwtService.generateToken(email);

        return ResponseEntity.ok(new LoginResponse(true, "OK", token));
    }


    /**
     * Endpunkt zum Zurücksetzen des Passworts eines Benutzers.
     * Überprüft, ob der Token gültig ist und setzt das Passwort zurück.
     *
     * @param token Der JWT-Token des Benutzers
     * @param body  Die Anfrage mit dem neuen Passwort
     * @return Eine ResponseEntity mit dem Ergebnis des Passwortzurücksetzens
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam("token") String token, @RequestBody Map<String, String> body) {

        // Benutzerdetails laden
        UserDetails userDetails = userDetailsService.loadUserByUsername(extractUsername(token));

        //hier wird Token von VerfiyUser() Methode übergeben
        if (!jwtService.validateToken(token, userDetails)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token ist ungültig");
        }
        //Finden den Benutzer anhand der Email
        String userEmail = jwtService.extractUsername(token);
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Benutzer nicht gefunden");
        }

        User user = userOptional.get();

        //Entschluesseln des neuen Passworts
        String newPassword = body.get("newPassword");
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encryptedPassword = encoder.encode(newPassword);

        //Setzen des neuen Passworts
        user.setPassword(encryptedPassword);
        userRepository.save(user);
        return ResponseEntity.ok("Passwort erfolgreich zurückgesetzt");
    }

    private String extractUsername(String token) {
        return jwtService.extractUsername(token);
    }




    /**
     * Benutzerlogin-Datenmodell.
     * Enthält den Benutzernamen und das Passwort für den Login-Vorgang.
     */
    @Setter
    @Getter
    public static class UserLoginRequest {
        private String email;// Benutzername
        private String password; // Passwort

    }

    /**
     * Antwortmodell für das Login.
     * Enthält den Status der Anmeldung (erfolgreich oder nicht), eine Nachricht und das JWT-Token.
     */
    @Getter
    public static class LoginResponse {
        private final boolean success; // Erfolgsstatus der Anmeldung
        private final String message;  // Nachricht zur Anmeldung
        private final String token;    // JWT-Token

        public LoginResponse(boolean success, String message, String token) {
            this.success = success;
            this.message = message;
            this.token = token;
        }

    }

    /**
     * Benutzeranmeldedatenmodell.
     * Enthält die Email und das Passwort für die Registrierung und Authentifizierung.
     */
    @Setter
    @Getter
    public static class UserCredentials {
        private String email; // Benutzername
        private String password; // Passwort

    }




}
