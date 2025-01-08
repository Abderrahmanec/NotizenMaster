package org.bootstmytool.backend.security;

import org.bootstmytool.backend.model.User;
import org.bootstmytool.backend.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;


import java.util.Collection;

/**
 * Ein benutzerdefinierter Service für die Authentifizierung von Benutzern.
 * Implementiert das Interface UserDetailsService, um die Benutzerinformationen
 * für die Authentifizierung in Spring Security bereitzustellen.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Konstruktor für die Initialisierung des Service mit dem UserRepository.
     *
     * @param userRepository Das Repository, um Benutzerdaten aus der Datenbank zu holen
     */
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Lädt die Benutzerinformationen basierend auf dem Benutzernamen.
     * Wird von Spring Security aufgerufen, um die Authentifizierung durchzuführen.
     *
     * @param username Der Benutzername des zu ladenden Benutzers
     * @return Die UserDetails des Benutzers
     * @throws UsernameNotFoundException Wenn der Benutzer mit dem angegebenen Benutzernamen nicht gefunden wird
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Versucht, den Benutzer aus der Datenbank zu laden
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Benutzer mit dem Benutzernamen " + username + " nicht gefunden"));
        
        // Holt die Berechtigungen des Benutzers (z.B. Rollen)
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
        
        // Gibt ein UserDetails-Objekt zurück, das die Benutzerinformationen und Berechtigungen enthält
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }
}
