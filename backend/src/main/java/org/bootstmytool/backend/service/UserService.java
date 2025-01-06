package org.bootstmytool.backend.service;

import org.bootstmytool.backend.dto.UserDTO;
import org.bootstmytool.backend.model.User;
import org.bootstmytool.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Registriert einen neuen Benutzer, indem er die Benutzerdaten aus einem UserDTO speichert.
     * Überprüft, ob der Benutzername bereits existiert.
     * 
     * @param userDTO die Benutzerdaten, die registriert werden sollen.
     * @return der gespeicherte Benutzer.
     * @throws RuntimeException wenn der Benutzername bereits existiert.
     */
    public User registerUser(UserDTO userDTO) {
        // Überprüft, ob der aBenutzername bereits existiert
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Erstellen eines neuen Benutzers
        User user = new User();
        user.setUsername(userDTO.getUsername());
        return userRepository.save(user);
    }

    /**
     * Holt einen Benutzer basierend auf dem Benutzernamen.
     * 
     * @param username der Benutzername des gesuchten Benutzers.
     * @return der Benutzer mit dem angegebenen Benutzernamen.
     * @throws UsernameNotFoundException wenn der Benutzer nicht gefunden wird.
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
