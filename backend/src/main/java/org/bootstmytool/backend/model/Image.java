package org.bootstmytool.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Die Image-Klasse stellt ein Bild dar, das mit einer Notiz verknüpft ist.
 * Das Bild wird in der Datenbank als Blob gespeichert und kann mit einer Notiz in einer "Viele-zu-Eins"-Beziehung verbunden werden.
 */
@Entity
@Table(name = "image")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Die eindeutige ID des Bildes

    private String url; // Die URL des Bildes
    @Lob
    private byte[] data; // Die Binärdaten des Bildes (in der Regel als Blob gespeichert)

    @ManyToOne
    @JoinColumn(name = "note_id")
    @JsonBackReference
    private Note note; // Die Notiz, zu der dieses Bild gehört

    @Column(name = "created_date")
    private java.time.LocalDateTime createdDate; // Neues Feld
    // Konstruktoren, Getter und Setter

    /**
     * Standardkonstruktor der Image-Klasse.
     * Wird von JPA benötigt.
     */
    public Image() {
        this.createdDate = java.time.LocalDateTime.now();
    }

    /**
     * Gibt die ID des Bildes zurück.
     *
     * @return Die ID des Bildes
     */
    public int getId() {
        return id;
    }

    /**
     * Setzt die ID des Bildes.
     *
     * @param id Die ID, die gesetzt werden soll
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Gibt die Binärdaten des Bildes zurück.
     *
     * @return Die Daten des Bildes als Byte-Array
     */
    public byte[] getData() {
        return data;
    }

    /**
     * Setzt die Binärdaten des Bildes.
     *
     * @param data Die Binärdaten des Bildes
     */
    public void setData(byte[] data) {
        this.data = data;
    }

    /**
     * Gibt die Notiz zurück, zu der dieses Bild gehört.
     *
     * @return Die Notiz, mit der dieses Bild verknüpft ist
     */
    public org.bootstmytool.backend.model.Note getNote() {
        return note;
    }

    /**
     * Setzt die Notiz, zu der dieses Bild gehört.
     *
     * @param note Die Notiz, mit der dieses Bild verknüpft werden soll
     */
    public void setNote(org.bootstmytool.backend.model.Note note) {
        this.note = note;
    }

    //set and get methods fuer url
    public void setUrl(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }



}


