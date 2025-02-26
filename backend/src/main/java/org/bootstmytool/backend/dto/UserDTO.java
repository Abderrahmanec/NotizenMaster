package org.bootstmytool.backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * @Author Mohamed Cheikh
 * @version 1.0
 * @Date: 2025-03-27
 * Die UserDTO (Data Transfer Object) Klasse wird verwendet, um Benutzerdaten wie
 * den Benutzernamen und das Passwort zwischen den verschiedenen Schichten der
 * Anwendung zu übertragen.
 */
@Setter
@Getter
@Data
public class UserDTO {
    /**
     * -- GETTER --
     *  Gibt den Benutzernamen des Benutzers zurück.
     *
     * -- SETTER --
     *  Setzt den Benutzernamen des Benutzers.
     *

     */
    private String email; // Der Benutzername des Benutzers
    /**
     * -- GETTER --
     *  Gibt das Passwort des Benutzers zurück.
     *
     * -- SETTER --
     *  Setzt das Passwort des Benutzers.
     *

     */
    private String password; // Das Passwort des Benutzers

}
