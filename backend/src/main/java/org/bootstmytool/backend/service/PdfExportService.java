package org.bootstmytool.backend.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfExportService {

    public byte[] generateNotePdf(String title, String content) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // fiegt den Titel und den Inhalt des Notiz-PDFs hinzu
        document.add(new Paragraph(title).setBold().setFontSize(16));
        document.add(new Paragraph(content));

        document.close();
        return baos.toByteArray();
    }
}