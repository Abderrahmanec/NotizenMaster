package org.bootstmytool.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/**
 * ProtectedController verwaltet den Endpunkt für den Zugriff auf geschützte Daten.
 * Um auf diesen Endpunkt zuzugreifen, muss der Benutzer ein gültiges JWT-Token im Autorisierungs-Header bereitstellen.
 */
@RestController
public class ProtectedController {

    private final org.bootstmytool.backend.service.JwtService jwtService; // Dienst zum Verarbeiten von JWT-Operationen

    /**
     * Konstruktor zum Injizieren des JwtService.
     *
     * @param jwtService Der JwtService zum Verarbeiten und Validieren von JWT-Tokens
     */
    public ProtectedController(org.bootstmytool.backend.service.JwtService jwtService) {
        this.jwtService = jwtService;
    }

    /**
     * Endpunkt zum Abrufen von geschützten Daten. Der Benutzer muss ein gültiges JWT-Token im Autorisierungs-Header übergeben.
     *
     * @param authHeader Der Autorisierungs-Header, der das Bearer-Token enthält
     * @return Eine ResponseEntity mit den geschützten Daten oder einer Fehlermeldung
     */
    @GetMapping("/api/protected/data")
    public ResponseEntity<?> getProtectedData(@RequestHeader("Authorization") String authHeader) {
        // Überprüfen, ob der Autorisierungs-Header vorhanden und korrekt formatiert ist
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Token extrahieren

            // Benutzername aus dem Token extrahieren
            String username = jwtService.extractUsername(token); // Validiert das Token und extrahiert den Benutzernamen
            if (username != null) {
                // Erfolgreicher Zugriff, wenn der Benutzername gültig ist
                return ResponseEntity.ok("Geschützte Daten für Benutzer: " + username);
            } else {
                // Fehler, wenn das Token ungültig oder abgelaufen ist
                return ResponseEntity.status(401).body("Ungültiges oder abgelaufenes Token.");
            }
        } else {
            // Fehler, wenn der Autorisierungs-Header fehlt oder falsch formatiert ist
            return ResponseEntity.status(400).body("Der Autorisierungs-Header fehlt oder ist ungültig.");
        }
    }
}
