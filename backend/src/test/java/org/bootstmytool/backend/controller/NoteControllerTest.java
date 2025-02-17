package org.bootstmytool.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.service.JwtService;
import org.bootstmytool.backend.service.NoteService;
import org.bootstmytool.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@ExtendWith(MockitoExtension.class) // Fokus auf den Controller
public class NoteControllerTest {

    @Mock
    private NoteService noteService;  // Service als Mock

    @Mock
    private UserService userService;  // Service als Mock

    @Mock
    private JwtService jwtService;  // Service als Mock

    @InjectMocks
    private NoteController noteController;  // Controller, der die gemockten Services verwendet

    private MockMvc mockMvc;  // MockMvc für Web-Tests

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(noteController).build();  // Setup von MockMvc für den Controller
    }





    @Test
    @WithMockUser // Simuliert einen authentifizierten Benutzer
    public void testDeleteNote() throws Exception {
        // Mock für die Rückgabe einer erfolgreichen Löschung
        when(noteService.deleteNoteById(anyInt())).thenReturn("Note deleted successfully");

        // DELETE-Anfrage an den Controller
        mockMvc.perform(MockMvcRequestBuilders.delete("/notes/delete/{id}", 1)
                        .header("Authorization", "Bearer valid-jwt-token"))
                .andExpect(status().isOk())  // Erwartet HTTP 200 OK
                .andExpect(content().string("Note deleted successfully"));
    }



    @Test
    @WithMockUser
    public void testEditNote() throws Exception {
        // Mock für die Bearbeitung einer Notiz
        Note note = new Note();
        note.setId(1);
        note.setTitle("Updated Test Note");
        note.setContent("This is an updated test note.");
        note.setTags(List.of("tag1", "tag2")); // Tags als List übergeben

        // Simuliere das Verhalten des NoteService
        when(noteService.editNoteById(eq(1), any(Note.class))).thenReturn(note);

        // PUT-Anfrage zum Bearbeiten der Notiz
        mockMvc.perform(MockMvcRequestBuilders.put("/notes/edit/{id}", 1)
                        .header("Authorization", "Bearer valid-jwt-token")
                        .content(new ObjectMapper().writeValueAsString(note))  // JSON-Inhalt
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())  // Erwartet HTTP 200 OK
                .andExpect(jsonPath("$.title").value("Updated Test Note"))
                .andExpect(jsonPath("$.content").value("This is an updated test note."));
    }






}
