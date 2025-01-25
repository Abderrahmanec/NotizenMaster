package org.bootstmytool.backend.service;

import org.bootstmytool.backend.model.Image;
import org.bootstmytool.backend.model.Note;
import org.bootstmytool.backend.repository.ImageRepository;
import org.bootstmytool.backend.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService {

  //fuegt die NoteRepository und ImageRepository Instanzen hinzu
    private final NoteRepository noteRepository;
    private final ImageRepository imageRepository;


  //fuegt die ImageRepository und NoteRepository Instanzen hinzu
    @Autowired
    public ImageService(NoteRepository noteRepository, ImageRepository imageRepository) {
        this.noteRepository = noteRepository;
        this.imageRepository = imageRepository;
    }


    //speichert ein Image Objekt in der Datenbank
    public List<Image> getImagesByNoteId(int noteId) {
        return imageRepository.findByNoteId(noteId);
    }
}
