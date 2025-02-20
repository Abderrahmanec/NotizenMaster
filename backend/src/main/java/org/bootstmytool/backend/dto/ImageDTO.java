package org.bootstmytool.backend.dto;

public class ImageDTO {
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
        this.id=id;
        this.url=url;
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

    public void setId(int id) {
        this.id=id;
    }

    public int getId() {
        return id;
    }
}