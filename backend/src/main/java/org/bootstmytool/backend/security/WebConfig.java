package org.bootstmytool.backend.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * Konfigurationsklasse für die Webanwendung.
 * <p>
 * Diese Klasse konfiguriert die Ressourcen-Handler für die Anwendung.
 * Sie definiert, wie Ressourcen wie Bilder oder CSS-Dateien geladen werden.
 */
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    //die Methode addResourceHandlers() wird ueberschrieben, um die Konfiguration fuer die Ressourcen-Handler zu aendern
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Definiert, wie Ressourcen aus dem Verzeichnis "frontend/static" geladen werden
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/backend/static/images/");

    }

 /**
     * Konfiguriert die CORS-Einstellungen für die Anwendung.
     * @param registry Die Registry für die CORS-Konfiguration
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "https:((*.vercel.app",
                    "https://notizen-master-*.vercel.app",
                    "https://*-abderrahmanecs-projects.vercel.app",
                    "http://localhost:3000" )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With")
            .allowedHeaders("*") 
                .allowCredentials(true)
                .maxAge(3600); // 1 hour
    }
    
}
