package org.bootstmytool.backend.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve images from the "static/images" directory in the frontend
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/frontend/static/images/");

       // Bild aus dem Ordner images
        registry.addResourceHandler("/image/**")
                .addResourceLocations("classpath:/frontend/images/"); // Pfad zu den Bildern
    }
}
