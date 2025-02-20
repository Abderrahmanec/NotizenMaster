package org.bootstmytool.backend.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    //die Methode addResourceHandlers() wird ueberschrieben, um die Konfiguration fuer die Ressourcen-Handler zu aendern
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve images from the "static/images" directory in the frontend
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/backend/static/images/");

    }
}
