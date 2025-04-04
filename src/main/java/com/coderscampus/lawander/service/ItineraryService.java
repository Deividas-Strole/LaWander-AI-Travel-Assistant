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

    public String getItinerary(String itinerary) {
        String input = String.format("Give me a list of 10 most popular things to do in %s. List every suggestion in different paragraph", itinerary);
//        String input = String.format("Create me a %s travel itinerary", itinerary);
        Prompt prompt = new Prompt(input);
        ChatResponse response = openAiChatModel.call(prompt);
        return response.getResult().getOutput().getContent();
    }
}
