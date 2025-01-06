package org.bootstmytool.backend.security;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Diese Klasse enthält nützliche Methoden für Netzwerkanfragen, insbesondere zum Abrufen der lokalen IP-Adresse.
 */
public class NetworkUtils {

    /**
     * Ruft die lokale IP-Adresse des Hosts ab.
     * Dies gibt die IP-Adresse des Geräts zurück, auf dem die Anwendung ausgeführt wird.
     *
     * @return Die lokale IP-Adresse als String (z. B. "192.168.x.x"), oder eine Fehlermeldung, wenn die IP-Adresse nicht gefunden werden kann.
     */
    public static String getLocalIpAddress() {
        try {
            InetAddress ip = InetAddress.getLocalHost(); // Holt die IP-Adresse des lokalen Hosts
            return ip.getHostAddress(); // Gibt die IP-Adresse im Format "192.168.x.x" zurück
        } catch (UnknownHostException e) {
            e.printStackTrace(); // Gibt eine Fehlermeldung aus, falls die IP-Adresse nicht gefunden werden kann
            return "IP not found"; // Rückgabe einer Fehlermeldung, wenn die IP-Adresse nicht ermittelt werden kann
        }
    }
}
