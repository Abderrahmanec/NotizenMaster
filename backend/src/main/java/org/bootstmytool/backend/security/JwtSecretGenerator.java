package org.bootstmytool.backend.security;

import java.security.SecureRandom;
import java.util.Base64;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * Diese Klasse generiert ein zufälliges Geheimnis (Secret Key) für JWT.
 * Sie bietet Methoden zur Erzeugung eines neuen Schlüssels oder zum Abrufen
 * eines vorhandenen Geheimnisses aus einer Umgebungsvariable.
 */
public class JwtSecretGenerator {

    /**
     * Generiert einen zufälligen geheimen Schlüssel (Secret Key) mit einer Länge von 256 Bit.
     * Der Schlüssel wird als Base64-kodierte Zeichenkette zurückgegeben.
     *
     * @return Der generierte geheime Schlüssel als Base64-kodierte Zeichenkette.
     */
    public static String generateSecretKey() {
        SecureRandom secureRandom = new SecureRandom(); // Instanziierung eines sicheren Zufallszahlengenerators
        byte[] secretKey = new byte[32]; // 256-Bit-Schluessel (32 Byte)
        secureRandom.nextBytes(secretKey); // Zufaelige Bytes generieren
        return Base64.getEncoder().encodeToString(secretKey); // Zurueckgabe des Schluessels als Base64-kodierte Zeichenkette
    }

    /**
     * Ruft den geheimen Schlüssel für JWT aus einer Umgebungsvariablen ab.
     * Wenn die Umgebungsvariable nicht gesetzt ist, wird ein neuer geheimer Schlüssel generiert.
     *
     * @return Der geheime Schlüssel, entweder aus der Umgebungsvariablen oder ein neu generierter Schlüssel.
     */
    public static String getSecretKey() {
        String secretKey = System.getenv("JWT_SECRET_KEY"); // Abrufen des Geheimnisses aus der Umgebungsvariablen
        if (secretKey == null || secretKey.isEmpty()) { // ueberpruefen, ob der Schlüssel leer oder null ist
            // Wenn der Schluessel nicht gesetzt ist, wird ein neuer Schluessel generiert
            secretKey = generateSecretKey();
        }
        return secretKey; // Zurueckgeben des Geheimnisses
    }
}
