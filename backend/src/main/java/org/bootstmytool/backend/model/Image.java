package org.bootstmytool.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


/**
 * @version 1.0
 * @Author: Mohamed Cheikh
 * @Date: 2025-03-27
 * Die Image-Klasse stellt ein Bild dar, das mit einer Notiz verknüpft ist.
 * Das Bild wird in der Datenbank als Blob gespeichert und kann mit einer Notiz in einer "Viele-zu-Eins"-Beziehung verbunden werden.
 */
@Entity
@Table(name = "image")
public class Image {

    /**
     * -- GETTER --
     * Gibt die ID des Bildes zurück.
     * -- SETTER --
     * Setzt die ID des Bildes.
     */
    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Die eindeutige ID des Bildes

    //set and get methods fuer url
    @Getter
    @Setter
    private String url; // Die URL des Bildes
    /**
     * -- SETTER --
     * Setzt die Binärdaten des Bildes.     *
     * -- GETTER --
     * Gibt die Binärdaten des Bildes zurück.
     */
    @Getter
    @Setter
    @Lob
    private byte[] data; // Die Binärdaten des Bildes (in der Regel als Blob gespeichert)

    /**
     * -- GETTER --
     * Gibt die Notiz zurück, zu der dieses Bild gehört.
     * -- SETTER --
     * Setzt die Notiz, zu der dieses Bild gehört.
     */
    @Setter
    @Getter
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


}


