package org.bootstmytool.backend.dto;

public class ImageDTO {
    private String url;

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

    /**
     * Gibt die URL des Bildes zurueck.
     *
     * @return Die URL des Bildes.
     */
    public String getUrl() {
        return url;
    }

    /**
     * Setzt die URL des Bildes.
     *
     * @param url Die URL des Bildes.
     */
    public void setUrl(String url) {
        this.url = url;
    }
}