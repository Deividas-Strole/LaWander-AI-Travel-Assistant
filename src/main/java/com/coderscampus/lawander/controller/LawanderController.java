package com.coderscampus.lawander.controller;

import com.coderscampus.lawander.domain.Note;
import com.coderscampus.lawander.domain.NoteId;
import com.coderscampus.lawander.service.ItineraryService;
import com.coderscampus.lawander.service.MyNotesService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class LawanderController {

    private final ItineraryService itineraryService;
    private final MyNotesService myNotesService;

    public LawanderController(ItineraryService itineraryService, ItineraryService itineraryService1, MyNotesService myNotesService) {
        this.itineraryService = itineraryService;
        this.myNotesService = myNotesService;
    }

    @GetMapping("/welcome")
    public String welcomePage() {
        System.out.println("inside welcome");
        return "itinerary";
    }

    @GetMapping("/generate")
    @ResponseBody
    public String travelItinerary(@RequestParam String itinerary, ModelMap model) throws JsonProcessingException {
        String response = itineraryService.getItinerary(itinerary);
        ObjectMapper mapper = new ObjectMapper();
        String jsonString = mapper.writeValueAsString(response);
        return jsonString;
    }

    @PostMapping("/save")
    @ResponseBody
    private ResponseEntity saveNotes (@RequestBody Note note) {
        System.out.println("note in controller: " + note);
        myNotesService.saveMyNotes(note);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/getNote")
    @ResponseBody
    private ResponseEntity returnNote(@RequestBody NoteId rawNoteId) {
        Long noteId = rawNoteId.getLongValue();
        System.out.println("noteId in controller: " + noteId);
        Note note = myNotesService.getNote(noteId);
        return ResponseEntity.ok().body(note);
    }
}
