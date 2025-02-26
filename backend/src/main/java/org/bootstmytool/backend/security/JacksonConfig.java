package org.bootstmytool.backend.security;


import com.fasterxml.jackson.core.StreamWriteConstraints;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * Konfigurationsklasse für Jackson.
 * <p>
 * Diese Klasse konfiguriert das Jackson-Objekt-Mapping für die Serialisierung von Objekten in JSON.
 * Sie aktiviert die Einrückung von JSON-Objekten und setzt die maximale Verschacht
 * lungstiefe auf 2000.
 */
@Configuration
public class JacksonConfig {

    /**
     * Konfiguriert das Jackson-Objekt-Mapping.
     */
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        objectMapper.getFactory().setStreamWriteConstraints(
                StreamWriteConstraints.builder().maxNestingDepth(2000).build()
        );
        return objectMapper;
    }
}