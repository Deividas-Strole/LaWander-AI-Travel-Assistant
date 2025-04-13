package com.coderscampus.lawander.service;

import org.springframework.stereotype.Service;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;

@Service
public class ChatService {

    private final OpenAiChatModel openAiChatModel;

    public ChatService(OpenAiChatModel openAiChatModel) {
        this.openAiChatModel = openAiChatModel;
    }

    public String processMessage(String message) {
        String input = String.format(message);
        Prompt prompt = new Prompt(input);
        ChatResponse response = openAiChatModel.call(prompt);
        return response.getResult().getOutput().getContent();
    }
}






//
//@Service
//public class ChatService {
//
//    public String processMessage(String message) {
//        // For now, return a simple response
//        // Later, you can hook in AI, travel plans logic, etc.
//        return "Sounds good! Let's plan your next adventure based on: " + message;
//    }
//}