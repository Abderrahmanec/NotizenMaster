package org.bootstmytool.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.bootstmytool.backend.dto.NoteDTO;
import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.model.User;
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
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@ExtendWith(MockitoExtension.class) // Fokus auf den Controller
public class NoteControllerTest {

    @Mock
    private NoteService noteService;  // Service als Mock

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
    public void testCreateNote() throws Exception {
        Note newNote = new Note();
        newNote.setTitle("Test Note");
        newNote.setContent("This is a test note.");
        newNote.setTags(Arrays.asList("tag1"));

        mockMvc.perform(MockMvcRequestBuilders.multipart("/notes/create")
                        .param("title", newNote.getTitle())
                        .param("description", newNote.getContent())
                        .param("tags", String.join(",", newNote.getTags())))
                .andExpect(status().isBadRequest());  // Expect HTTP 400 due to missing Authorization header
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







}
