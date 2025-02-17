package org.bootstmytool.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

   // private static final long JWT_EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours
   //private static final long JWT_EXPIRATION_TIME = 1000 * 60 * 1; // 1 minute
   @Value("${jwt.expiration}")
   private long JWT_EXPIRATION_TIME;

    /**
     * Retrieves the signing key, ensuring it is at least 32 characters long.
     */
    private Key getSigningKey() {
        if (secret.length() < 32) {
            throw new IllegalArgumentException("The secret key must be at least 32 characters long");
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Extracts the username (subject) from the JWT token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts a specific claim from the JWT token.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from the JWT token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Checks if the JWT token is expired.
     */
    public Boolean isTokenExpired(String token) {
        Date expirationDate = extractExpiration(token);
        System.out.println("Token expiration date: " + expirationDate);
        return expirationDate.before(new Date());
    }


    /**
     * Extracts the expiration date from the JWT token.
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Generates a JWT token for the given username with an expiration time.
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validates the JWT token by comparing the username and checking expiration.
     */
    public boolean validateToken(String jwt, UserDetails userDetails) {
        final String username = extractUsername(jwt);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(jwt));
    }
}
