package org.bootstmytool.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Die NoteDTO (Data Transfer Object) Klasse wird verwendet, um eine Notiz zwischen
 * den verschiedenen Schichten der Anwendung zu übertragen. Sie enthält grundlegende
 * Informationen über die Notiz wie Titel, Inhalt und Tags.
 */
@Data
public class NoteDTO {

    private String title; // Der Titel der Notiz
    private String content; // Der Inhalt der Notiz
    private List<String> tags; // Die Tags, die mit der Notiz verknüpft sind
    private int id;
    private List<ImageDTO> images;
    private List<Integer> imagesToDelete;
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
     * @return Eine Liste von Tags, die mit der Notiz verknüpft sind
     */
    public List<String> getTags() {
        return tags;
    }

    /**
     * Setzt die Tags der Notiz.
     *
     * @param tags Eine Liste von Tags, die gesetzt werden sollen
     */
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public void setImages(@NotNull List<ImageDTO> images) {
        // Validieren, dass die Liste nicht null ist
        this.images = Objects.requireNonNull(images, "Bilderliste darf nicht null sein");

        // Optional:validieren, dass die Liste keine null-Elemente enthält
        if (images.stream().anyMatch(Objects::isNull)) {
            throw new IllegalArgumentException("Bilderliste darf keine null-Elemente enthalten");
        }
    }
    public void setImagesToDelete(List<Integer> imagesToDelete) {
        this.imagesToDelete = imagesToDelete;
    }

    public List<Integer> getImagesToDelete() {
        if (imagesToDelete == null) {
            imagesToDelete = new ArrayList<>();
        }
        return imagesToDelete;
    }

    public void setTag(String tag) {
        this.tags = new ArrayList<>();
        this.tags.add(tag);
    }
}
