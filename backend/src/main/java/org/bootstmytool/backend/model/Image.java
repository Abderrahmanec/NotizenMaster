package org.bootstmytool.backend.model;

import jakarta.persistence.*;

/**
 * Die Image-Klasse stellt ein Bild dar, das mit einer Notiz verknüpft ist.
 * Das Bild wird in der Datenbank als Blob gespeichert und kann mit einer Notiz in einer "Viele-zu-Eins"-Beziehung verbunden werden.
 */
@Entity
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Die eindeutige ID des Bildes

    @Lob
    private byte[] data; // Die Binärdaten des Bildes (in der Regel als Blob gespeichert)

    @ManyToOne
    @JoinColumn(name = "note_id")
    private org.bootstmytool.backend.model.Note note; // Die Notiz, zu der dieses Bild gehört

    // Konstruktoren, Getter und Setter

    /**
     * Standardkonstruktor der Image-Klasse.
     * Wird von JPA benötigt.
     */
    public Image() {
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
    public void setUrl(String s) {
        throw new UnsupportedOperationException("Nicht unterstützt."); //To change body of generated methods, choose Tools | Templates.
    }

    public String getUrl() {
        throw new UnsupportedOperationException("Nicht unterstützt."); //To change body of generated methods, choose Tools | Templates.
    }
}


