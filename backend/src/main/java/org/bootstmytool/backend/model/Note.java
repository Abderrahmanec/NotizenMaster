package org.bootstmytool.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @version 1.0
 * @Author: Mohamed Cheikh
 * @Date: 2025-03-27
 * Die Note-Klasse stellt eine Notiz dar, die von einem Benutzer erstellt wurde.
 * Sie enthält den Titel, den Inhalt, Tags und eine Liste von Bildern, die mit der Notiz verbunden sind.
 * Eine Notiz ist mit einem Benutzer in einer "Viele-zu-Eins"-Beziehung verknüpft.
 */
@Getter
@Entity
@Table(name = "note")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Note {

    /**
     * -- SETTER --
     * Setzt die ID der Notiz.
     * -- GETTER --
     * Gibt die ID der Notiz zurück.
     */
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Die eindeutige ID der Notiz

    /**
     * -- SETTER --
     * Setzt den Titel der Notiz.
     * <p>
     * -- GETTER --
     * Gibt den Titel der Notiz zurück.
     */
    @Setter
    private String title; // Der Titel der Notiz
    /**
     * -- SETTER --
     * Setzt den Inhalt der Notiz.
     * -- GETTER --
     * Gibt den Inhalt der Notiz zurück.
     */
    @Setter
    @Lob
    private String content; // Der Inhalt der Notiz

    /**
     * -- SETTER --
     * Setzt die Tags der Notiz.
     * -- GETTER --
     * Gibt die Tags der Notiz zurück.
     */
    @Setter
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "note_tags", joinColumns = @JoinColumn(name = "note_id"))
    private List<String> tags = new ArrayList<>(); // Die Tags, die der Notiz zugeordnet sind

    /**
     * -- SETTER --
     * Setzt den Benutzer, der die Notiz erstellt hat.
     * <p>
     * -- GETTER --
     * Gibt den Benutzer zurück, der die Notiz erstellt hat.
     */
    @Setter
    @ManyToOne
    @JsonBackReference // Verhindert die rekursive Serialisierung
    private org.bootstmytool.backend.model.User user; // Der Benutzer, der die Notiz erstellt hat

    /**
     * -- SETTER --
     * Setzt die Liste der Bilder, die mit der Notiz verbunden sind.
     * <p>
     * -- GETTER --
     * Gibt die Bilder zurück, die mit der Notiz verbunden sind.
     */
    @Setter
    @OneToMany(mappedBy = "note", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference // Verwaltet die Kindobjekte (Bilder)
    private List<Image> images = new ArrayList<>(); // Eine Liste von Bildern, die mit der Notiz verbunden sind

    /**
     * -- GETTER --
     * Gibt das Erstellungsdatum der Notiz zurück.
     */
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdAt;


    // Konstruktoren, Getter und Setter

    /**
     * Standardkonstruktor der Note-Klasse.
     * Wird von JPA benötigt.
     */
    public Note() {
    }


}
