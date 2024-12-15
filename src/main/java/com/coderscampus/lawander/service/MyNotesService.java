package com.coderscampus.lawander.service;

import com.coderscampus.lawander.domain.Note;
import com.coderscampus.lawander.repository.MyNotesRepo;
import org.springframework.stereotype.Service;

@Service
public class MyNotesService {

    private final MyNotesRepo myNotesRepo;

    public MyNotesService(MyNotesRepo myNotesRepo) {
        this.myNotesRepo = myNotesRepo;
    }

    public void saveMyNotes(Note note) {
        System.out.println("note in service: " + note);

        myNotesRepo.save(note);
    }

    public Note getNote(Long noteId) {
        System.out.println("noteId in service: " + noteId);

        return myNotesRepo.findById(noteId).orElse(null);
    }
}
