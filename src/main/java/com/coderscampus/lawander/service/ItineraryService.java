package com.coderscampus.lawander.service;

import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.stereotype.Service;

@Service
public class ItineraryService {

    private final OpenAiChatModel openAiChatModel;

    public ItineraryService(OpenAiChatModel openAiChatModel) {
        this.openAiChatModel = openAiChatModel;
    }

    public String getItinerary(String itinerary, int days) {
        String input = String.format("Give me a list of " + days * 4 + " most popular places to go in %s. Put each place (name and description together) between ' and separate each place by ,. Also, put the name of each place between * and the description after. Do not put numbers in front.", itinerary);
//        String input = String.format("Give me a list of " + days * 4 + " most popular places to visit in %s. List the place names separated by coma only, no numbers or other symbols.", itinerary);
//        String input = String.format("Create me a %s travel itinerary", itinerary);
        Prompt prompt = new Prompt(input);
        ChatResponse response = openAiChatModel.call(prompt);
        return response.getResult().getOutput().getContent();
    }
}
