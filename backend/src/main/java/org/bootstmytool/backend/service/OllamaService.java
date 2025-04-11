package org.bootstmytool.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class OllamaService {

    private final WebClient webClient;

    public OllamaService(WebClient.Builder webClientBuilder) {
        // initliert den WebClient mit einer Basis-URL und Timeout-Einstellungen
        this.webClient = webClientBuilder.baseUrl("http://localhost:11434/api/generate").build();

    }

    public Mono<String> summarizeText(String prompt) {
        String requestBody = String.format("""
        {
            "model": "mistral",
            "prompt": "%s",
            "stream": false
        }
        """, prompt.replace("\"", "\\\""));

        return webClient.post()
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    // Parse the JSON response to extract the actual summary
                    try {
                        JsonNode jsonNode = new ObjectMapper().readTree(response);
                        return jsonNode.path("response").asText();
                    } catch (Exception e) {
                        throw new RuntimeException("Fehler ", e);
                    }
                });
    }


}
