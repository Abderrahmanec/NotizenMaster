package org.bootstmytool.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Die Note-Klasse stellt eine Notiz dar, die von einem Benutzer erstellt wurde.
 * Sie enthält den Titel, den Inhalt, Tags und eine Liste von Bildern, die mit der Notiz verbunden sind.
 * Eine Notiz ist mit einem Benutzer in einer "Viele-zu-Eins"-Beziehung verknüpft.
 */
@Entity
@Table(name = "note")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Die eindeutige ID der Notiz

    private String title; // Der Titel der Notiz
    @Lob
    private String content; // Der Inhalt der Notiz

    @ElementCollection
    @CollectionTable(name = "note_tags", joinColumns = @JoinColumn(name = "note_id"))
    private List<String> tags=new ArrayList<>(); // Die Tags, die der Notiz zugeordnet sind

    @ManyToOne
    @JsonBackReference // Verhindert die rekursive Serialisierung
    private org.bootstmytool.backend.model.User user; // Der Benutzer, der die Notiz erstellt hat

    @OneToMany(mappedBy = "note",fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference // Verwaltet die Kindobjekte (Bilder)
    private List<Image> images=new ArrayList<>(); // Eine Liste von Bildern, die mit der Notiz verbunden sind

    // Konstruktoren, Getter und Setter

    /**
     * Standardkonstruktor der Note-Klasse.
     * Wird von JPA benötigt.
     */
    public Note() {
    }

    /**
     * Gibt die ID der Notiz zurück.
     *
     * @return Die ID der Notiz
     */
    public int getId() {
        return id;
    }

    /**
     * Setzt die ID der Notiz.
     *
     * @param id Die ID, die gesetzt werden soll
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Gibt den Titel der Notiz zurück.
     *
     * @return Der Titel der Notiz
     */
    public String getTitle() {
        return title;
    }

    /**
     * Setzt den Titel der Notiz.
     *
     * @param title Der Titel, der gesetzt werden soll
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Gibt den Inhalt der Notiz zurück.
     *
     * @return Der Inhalt der Notiz
     */
    public String getContent() {
        return content;
    }

    /**
     * Setzt den Inhalt der Notiz.
     *
     * @param content Der Inhalt, der gesetzt werden soll
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * Gibt die Tags der Notiz zurück.
     *
     * @return Eine Liste der Tags der Notiz
     */
    public List<String> getTags() {
        return tags;
    }

    /**
     * Setzt die Tags der Notiz.
     *
     * @param tags Eine Liste der Tags, die gesetzt werden sollen
     */
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    /**
     * Gibt den Benutzer zurück, der die Notiz erstellt hat.
     *
     * @return Der Benutzer der Notiz
     */
    public User getUser() {
        return user;
    }

    /**
     * Setzt den Benutzer, der die Notiz erstellt hat.
     *
     * @param user Der Benutzer, der gesetzt werden soll
     */
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Gibt die Bilder zurück, die mit der Notiz verbunden sind.
     *
     * @return Eine Liste der Bilder
     */
    public List<Image> getImages() {
        return images;
    }

    /**
     * Setzt die Liste der Bilder, die mit der Notiz verbunden sind.
     *
     * @param imageList Eine Liste der Bilder
     */
    public void setImages(List<org.bootstmytool.backend.model.Image> imageList) {
        this.images = imageList;
    }
}
