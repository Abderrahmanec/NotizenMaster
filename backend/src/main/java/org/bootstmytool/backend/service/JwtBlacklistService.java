package org.bootstmytool.backend.service;


import org.springframework.stereotype.Service;


import java.util.HashSet;
import java.util.Set;

/**
 * Service zum Verwalten einer Blacklist für JWT-Tokens.
 * <p>
 * Diese Klasse bietet Methoden, um JWT-Tokens zu sperren (blacklisten),
 * zu überprüfen, ob ein Token gesperrt ist, und gesperrte Tokens bei Bedarf zu entfernen.
 * Für produktive Umgebungen sollte eine persistente Lösung wie Redis oder eine Datenbank in Betracht gezogen werden.
 */
@Service
public class JwtBlacklistService {

    // In-Memory-Blacklist. Für den Produktionseinsatz sollte eine persistente Speicherung genutzt werden.
    private final Set<String> blacklistedTokens = new HashSet<>();

    /**
     * Fügt ein JWT-Token zur Blacklist hinzu.
     *
     * @param token das JWT-Token, das auf die Blacklist gesetzt werden soll
     */
    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }

    /**
     * Prüft, ob ein JWT-Token auf der Blacklist steht.
     *
     * @param token das zu prüfende JWT-Token
     * @return true, wenn das Token auf der Blacklist ist, ansonsten false
     */
    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    /**
     * Entfernt ein JWT-Token aus der Blacklist.
     * Kann z. B. genutzt werden, wenn ein Administrator ein Token wieder freigibt.
     *
     * @param token das JWT-Token, das von der Blacklist entfernt werden soll
     */
    public void removeTokenFromBlacklist(String token) {
        blacklistedTokens.remove(token);
    }

    /**
     * Ungültig machen eines Tokens durch Hinzufügen zur Blacklist.
     *
     * @param token das JWT-Token, das ungültig gemacht werden soll
     */
    public void invalidateToken(String token) {
        blacklistToken(token);
    }
}
