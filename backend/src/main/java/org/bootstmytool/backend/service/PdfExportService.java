package org.bootstmytool.backend.service;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfExportService {

    private static final String LOGO_PATH = "backend/src/main/resources/static/logo.png";

    public byte[] generateNotePdf(String title, String content) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        try {
            // Create ImageData for the logo
            ImageData imageData = ImageDataFactory.create(LOGO_PATH);
            Image logo = new Image(imageData);

//  Skaliere das Logo auf eine Breite von 100px und eine Höhe von 50px
            logo.scaleToFit(100, 50);

// Get die Breite und Höhe der Seite
            float pageWidth = pdf.getDefaultPageSize().getWidth();
            float pageHeight = pdf.getDefaultPageSize().getHeight();

//Berechne die Position des Logos
            float x = pageWidth - logo.getImageScaledWidth() - 20; // 20px padding from the right
            float y = pageHeight - logo.getImageScaledHeight() - 20; // 20px padding from the top

//setze die Position des Logos
            logo.setFixedPosition(x, y);

//  Füge das Logo zum Dokument hinzu
            document.add(logo);

        } catch (IOException e) {
            e.printStackTrace();
        }

        // Füge den Titel und den Inhalt der Notiz hinzu
        document.add(new Paragraph("\n\n" + title).setBold().setFontSize(16));
        document.add(new Paragraph(content));

        document.close();
        return baos.toByteArray();
    }
}
