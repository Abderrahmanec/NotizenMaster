package org.bootstmytool.backend.controller;

import lombok.RequiredArgsConstructor;
import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.repository.NoteRepository;
import org.bootstmytool.backend.service.PdfExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/pdf")
@RequiredArgsConstructor
public class PdfController {

    private final NoteRepository noteRepository;
    private final PdfExportService pdfExportService;

    @GetMapping("/{id}/export/pdf")
    public ResponseEntity<byte[]> exportNoteToPdf(@PathVariable int id) throws IOException {

        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note nicht gefunden"));

        byte[] pdfContent = pdfExportService.generateNotePdf(note.getTitle(), note.getContent());


        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=note-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

}