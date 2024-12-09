package com.coderscampus.lawander.controller;

import com.coderscampus.lawander.service.ItineraryService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class LawanderController {

    private final ItineraryService jokeService;

    public LawanderController(ItineraryService itineraryService) {
        this.jokeService = itineraryService;
    }

    @GetMapping("/welcome")
    public String welcomePage() {
        System.out.println("inside welcome");
        return "itinerary";
    }

//    @GetMapping("/testas")
//    public String test() {
//        System.out.println("inside test");
//        return "test";
//    }

    @PostMapping("/generate")
//    @ResponseBody
    public String travelItinerary(@RequestParam String itinerary, ModelMap model) {
        String response = jokeService.getJoke(itinerary);
        System.out.println("responce: " + response);
        model.put("response", response);
        return "test";
    }

}
