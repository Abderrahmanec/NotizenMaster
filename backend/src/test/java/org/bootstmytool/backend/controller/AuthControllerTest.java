package org.bootstmytool.backend.controller;


import org.bootstmytool.backend.service.AuthService;
import org.bootstmytool.backend.service.JwtService;
import org.bootstmytool.backend.controller.AuthController.LoginResponse;
import org.bootstmytool.backend.controller.AuthController.UserLoginRequest;
import org.bootstmytool.backend.controller.AuthController.UserCredentials;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthController authController;

    private UserLoginRequest validLoginRequest;
    private UserCredentials validCredentials;

    @BeforeEach
    void setUp() {
        // Initialisiere Testdaten
        validLoginRequest = new UserLoginRequest();
        validLoginRequest.setUsername("testUser");
        validLoginRequest.setPassword("password123");

        validCredentials = new UserCredentials();
        validCredentials.setUsername("testUser");
        validCredentials.setPassword("password123");
    }

    @Test
    void testLoginSuccess() {
        // Mock der Authentifizierung und Token-Erstellung
        when(authService.authenticate(validLoginRequest.getUsername(), validLoginRequest.getPassword())).thenReturn(true);
        when(jwtService.generateToken(validLoginRequest.getUsername())).thenReturn("mockJwtToken");

        // Controller aufrufen
        ResponseEntity<?> response = authController.login(validLoginRequest);

        // Überprüfen, ob das Login erfolgreich war
        assertEquals(200, response.getStatusCodeValue());
        LoginResponse loginResponse = (LoginResponse) response.getBody();
        assertTrue(loginResponse.isSuccess());
        assertNotNull(loginResponse.getToken());
    }

    @Test
    void testLoginFailure() {
        // Mock der Authentifizierung für Fehlerfall
        when(authService.authenticate(validLoginRequest.getUsername(), validLoginRequest.getPassword())).thenReturn(false);

        // Controller aufrufen
        ResponseEntity<?> response = authController.login(validLoginRequest);

        // Überprüfen, ob das Login fehlgeschlagen ist
        assertEquals(401, response.getStatusCodeValue());
        LoginResponse loginResponse = (LoginResponse) response.getBody();
        assertFalse(loginResponse.isSuccess());
        assertNull(loginResponse.getToken());
    }

    @Test
    void testRegisterSuccess() {
        // Mock für erfolgreiche Registrierung
        when(authService.registerUser(validCredentials.getUsername(), validCredentials.getPassword())).thenReturn(true);

        // Controller aufrufen
        ResponseEntity<String> response = authController.register(validCredentials);

        // Überprüfen, ob die Registrierung erfolgreich war
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Registrierung erfolgreich", response.getBody());
    }

    @Test
    void testRegisterFailure() {
        // Mock für Fehler bei der Registrierung
        when(authService.registerUser(validCredentials.getUsername(), validCredentials.getPassword())).thenReturn(false);

        // Controller aufrufen
        ResponseEntity<String> response = authController.register(validCredentials);

        // Überprüfen, ob die Registrierung fehlgeschlagen ist
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Benutzername existiert bereits", response.getBody());
    }




}

