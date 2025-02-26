package org.bootstmytool.backend.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.bootstmytool.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


/**
 * @Author Mohamed Cheikh
 * @Version 1.0
 * @Date: 2025-03-27
 * Filter, der jede Anfrage überprüft und sicherstellt, dass der Benutzer authentifiziert ist,
 * indem ein gültiger JWT-Token im Authorization-Header der Anfrage übermittelt wird.
 * Wird nur einmal pro Anfrage ausgeführt (OncePerRequestFilter).
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtTokenUtil;
    private final CustomUserDetailsService customUserDetailsService;

    /**
     * Konstruktor für den JwtAuthenticationFilter.
     *
     * @param jwtTokenUtil             Das Service-Objekt, das für die Verarbeitung von JWT-Tokens verantwortlich ist
     * @param customUserDetailsService Das Service-Objekt für die Benutzerinformationen
     */
    @Autowired
    public JwtAuthenticationFilter(JwtService jwtTokenUtil, CustomUserDetailsService customUserDetailsService) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.customUserDetailsService = customUserDetailsService;
    }

    /**
     * Diese Methode filtert die eingehenden HTTP-Anfragen und überprüft, ob ein gültiger JWT-Token vorhanden ist.
     * Falls der Token gültig ist, wird der Benutzer im SecurityContext authentifiziert.
     *
     * @param request     Die eingehende HTTP-Anfrage
     * @param response    Die Antwort, die an den Client zurückgeschickt wird
     * @param filterChain Die Filterkette, die nach der Authentifizierung fortgesetzt wird
     * @throws ServletException Wenn eine Servlet-spezifische Ausnahme auftritt
     * @throws IOException      Wenn ein Fehler beim Verarbeiten der Anfrage oder Antwort auftritt
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtTokenUtil.extractUsername(jwt);

                // Ueberprueft, ob der Token abgelaufen ist
                if (jwtTokenUtil.isTokenExpired(jwt)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Token ist abgelaufen");
                    return;
                }

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Ungültiger Token");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.customUserDetailsService.loadUserByUsername(username);

            if (jwtTokenUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        // Fahre mit der Filterkette fort
        filterChain.doFilter(request, response);
    }
}
