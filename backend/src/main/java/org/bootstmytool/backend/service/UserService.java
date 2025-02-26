package org.bootstmytool.backend.service;

import org.bootstmytool.backend.model.User;
import org.bootstmytool.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * Service-Klasse für Benutzer-Operationen.
 */

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Holt einen Benutzer basierend auf dem Benutzernamen.
     *
     * @param email die Email des gesuchten Benutzers.
     * @return der Benutzer mit dem angegebenen Benutzernamen.
     * @throws UsernameNotFoundException wenn der Benutzer nicht gefunden wird.
     */
    public User getUserByUsername(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Benutzer mit der Email " + email + " nicht gefunden."));
    }


    public Optional<User> findByUsername(String username) {
        return userRepository.findByEmail(username);
    }
}
