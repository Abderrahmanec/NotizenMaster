package org.bootstmytool.backend.security;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.DefaultHttpFirewall;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * Diese Klasse enthält die Sicherheitskonfiguration für die Anwendung.
 * Sie konfiguriert den Zugriff auf Endpunkte, die Verwendung von JWT und CORS-Einstellungen.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    /**
     * Initialisiert die Sicherheitskonfiguration und stellt sicher, dass ein geheimes JWT erstellt wird.
     */
    @PostConstruct
    public void init() {
        // Setzt das geheime Schluessel für JWT, falls nicht bereits in der Konfiguration gesetzt
        this.jwtSecret = JwtSecretGenerator.getSecretKey();
    }

    /**
     * Konstruktor für die Sicherheitskonfiguration.
     *
     * @param jwtAuthenticationFilter Filter für die JWT-Authentifizierung
     * @param userDetailsService      Service für die Benutzerinformationen
     */
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, UserDetailsService userDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Bean für den Passwort-Encoder.
     * Verwendet den BCryptPasswordEncoder zur Verschlüsselung von Passwörtern.
     *
     * @return ein instanziierter PasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Bean für den AuthenticationManager.
     * Ermöglicht die Authentifizierung von Benutzern.
     *
     * @param authenticationConfiguration die Konfiguration des Authentifizierungsmanagers
     * @return der AuthenticationManager
     * @throws Exception falls die Konfiguration fehlschlägt
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Konfiguriert die Sicherheitsrichtlinien für die Anwendung.
     * - CORS und CSRF werden deaktiviert.
     * - JWT wird zur Authentifizierung verwendet.
     * - Alle Endpunkte erfordern eine Authentifizierung, außer "/api/auth/**".
     *
     * @param http die HttpSecurity-Konfiguration
     * @return die konfigurierte SecurityFilterChain
     * @throws Exception wenn eine Fehler in der Sicherheitskonfiguration auftritt
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // Deaktiviert CSRF-Schutz

                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Aktiviert CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Erlaubt OPTIONS-Anfragen
                        .requestMatchers("/api/auth/**").permitAll() // Authentifizierung wird für Auth-Endpunkte nicht verlangt
                        .requestMatchers("/actuator/**").permitAll() // Erlaubt den Zugriff auf Actuator-Endpunkte
                        .requestMatchers("/images/**").permitAll() //Erstellt eine neue Notiz.requestMatchers("/image/**").permitAll() // Erlaubt den Zugriff auf Benutzer
                        .requestMatchers("/image/**").permitAll() //Erstellt eine neue Notiz.requestMatchers("/image/**").permitAll() // Erlaubt den Zugriff auf Benutzer
                        .anyRequest().authenticated() // Alle anderen Anfragen erfordern Authentifizierung
                      
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // Stateless-Session

        // Fuegt den JWT-Filter hinzu
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Bean für die CORS-Konfiguration.
     * Legt fest, welche Domains und HTTP-Methoden zugelassen sind.
     *
     * @return die konfigurierte CORS-Quelle
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
    corsConfiguration.setAllowedOrigins(Arrays.asList("https://notizen-master.vercel.app","https://*.vercel.app", "https://notizen-master-git-main-abderrahmanecs-projects.vercel.app"
    "));
        
         // Frontend-URLs erlauben
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Erlaubte HTTP-Methoden
        corsConfiguration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With")); // Erlaubte Header
          corsConfiguration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type")); // Exposed headers
        corsConfiguration.setMaxAge(3600L); 
        
        corsConfiguration.setAllowCredentials(true); // Erlaubt Cookies und Authentifizierung
        // Registrierung der CORS-Konfiguration für alle Endpunkte
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }


    @Bean
    public HttpFirewall allowDoubleSlashFirewall() {
        return new DefaultHttpFirewall(); // DefaultHttpFirewall allows double slashes
    }
}
