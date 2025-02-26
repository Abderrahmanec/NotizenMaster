package org.bootstmytool.backend.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * @version 1.0
 * @Author Mohamed Cheikh
 * @Date: 2025-03-27
 * Das ImageDTO (Data Transfer Object) wird verwendet, um Bilddaten zwischen den verschiedenen Schichten der Anwendung zu übertragen.
 * Es enthält grundlegende Informationen über das Bild wie die URL.
 */
@Setter
@Getter
public class ImageDTO {
    /**
     * -- GETTER --
     * Gibt die URL des Bildes zurueck.
     * <p>
     * -- SETTER --
     * Setzt die URL des Bildes.
     */
    private String url;
    private int id;

    /**
     * Erstellt ein neues ImageDTO.
     */
    public ImageDTO() {
    }

    /**
     * Erstellt ein neues ImageDTO.
     *
     * @param url Die URL des Bildes.
     */
    public ImageDTO(String url) {
        this.url = url;
    }

    public ImageDTO(int id, String url) {
        this.id = id;
        this.url = url;
    }

}