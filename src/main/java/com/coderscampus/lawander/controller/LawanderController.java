package com.coderscampus.lawander.controller;

import com.coderscampus.lawander.service.ItineraryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class LawanderController {

    private final ItineraryService itineraryService;

    public LawanderController(ItineraryService itineraryService, ItineraryService itineraryService1) {
        this.itineraryService = itineraryService;
    }

    @GetMapping("/welcome")
    public String welcomePage() {
        System.out.println("inside welcome");
        return "itinerary";
    }

//    @GetMapping("/testas")
//    public String test() {
//        System.out.println("inside test");
//        return "test2222222";
//    }

    @GetMapping("/generate")
    @ResponseBody
    public String travelItinerary(@RequestParam String itinerary, ModelMap model) throws JsonProcessingException {
        System.out.println("******************** inside generate");

        String response = itineraryService.getItinerary(itinerary);
        System.out.println("responce: " + response);
//        model.put("response", response);

        ObjectMapper mapper = new ObjectMapper();
        String jsonString = mapper.writeValueAsString(response);
        return jsonString;

        //return "test";
    }

}
