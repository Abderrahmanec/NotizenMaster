package org.bootstmytool.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.bootstmytool.backend.model.Note;
import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * @Author Mohamed Cheikh
 * @version 1.0
 * @Date: 2025-03-27
 * Die NoteDTO (Data Transfer Object) Klasse wird verwendet, um eine Notiz zwischen
 * den verschiedenen Schichten der Anwendung zu übertragen. Sie enthält grundlegende
 * Informationen über die Notiz wie Titel, Inhalt und Tags.
 */
@Data
public class NoteDTO {

    /**
     * -- GETTER --
     * Gibt den Titel der Notiz zurück.
     * <p>
     * -- SETTER --
     * Setzt den Titel der Notiz.
     *
     */
    @Setter
    @Getter
    private String title; // Der Titel der Notiz
    /**
     * -- GETTER --
     * Gibt den Inhalt der Notiz zurück.
     * <p>
     * <p>
     * -- SETTER --
     * Setzt den Inhalt der Notiz.
     *
     */
    @Setter
    @Getter
    private String content; // Der Inhalt der Notiz
    /**
     * -- GETTER --
     * Gibt die Tags der Notiz zurück.
     * <p>
     * <p>
     * -- SETTER --
     * Setzt die Tags der Notiz.
     *
     */
    @Setter
    @Getter
    private List<String> tags; // Die Tags, die mit der Notiz verknüpft sind
    private int id;
    private List<ImageDTO> images;
    @Setter
    private List<Integer> imagesToDelete;

    public void setImages(@NotNull List<ImageDTO> images) {
        // Validieren, dass die Liste nicht null ist
        this.images = Objects.requireNonNull(images, "Bilderliste darf nicht null sein");
        // Validieren, dass die Liste keine null-Elemente enthält
        if (images.stream().anyMatch(Objects::isNull)) {
            throw new IllegalArgumentException("Bilderliste darf keine null-Elemente enthalten");
        }
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

    @Getter
    @Value("${app.base-url:http://localhost:8080}")
    private static String baseUrl;

    /**
     * Konvertiert eine NoteDTO in eine Note.
     *
     * @param note Die NoteDTO, die konvertiert werden soll
     * @return Die konvertierte Note
     */
    public static NoteDTO convertToDto(Note note) {
        NoteDTO dto = new NoteDTO();
        dto.setId(note.getId());
        dto.setTitle(note.getTitle());
        dto.setContent(note.getContent());
        dto.setTags(note.getTags());
        dto.setImages(note.getImages().stream()
                .map(image -> new ImageDTO(image.getId(), baseUrl + "/image/" + image.getUrl()))
                .collect(Collectors.toList()));
        return dto;
    }

}
