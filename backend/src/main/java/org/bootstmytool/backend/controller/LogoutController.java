package org.bootstmytool.backend.controller;

import org.bootstmytool.backend.service.JwtBlacklistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LogoutController {

    private final JwtBlacklistService jwtBlacklistService;

    public LogoutController(JwtBlacklistService jwtBlacklistService) {
        this.jwtBlacklistService = jwtBlacklistService;
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            jwtBlacklistService.invalidateToken(token);
            return ResponseEntity.ok("Erfolgreich ausgeloggt.");
        }
        return ResponseEntity.badRequest().body("Ungültiger Authorization-Header.");
    }
}
