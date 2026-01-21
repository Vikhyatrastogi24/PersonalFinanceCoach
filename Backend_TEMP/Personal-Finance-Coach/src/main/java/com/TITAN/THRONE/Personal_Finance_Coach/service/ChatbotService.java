package com.TITAN.THRONE.Personal_Finance_Coach.service;

import com.TITAN.THRONE.Personal_Finance_Coach.exception.CustomException;
import com.TITAN.THRONE.Personal_Finance_Coach.model.ChatbotMessage;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.repo.ChatbotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatbotRepository chatbotRepository;

    private final WebClient webClient;

    @Value("${openrouter.api.key}")
    private String openrouterApiKey;

    @Value("${openrouter.api.url}")
    private String openrouterApiUrl;

    @Value("${openrouter.model}")
    private String openrouterModel;

    public ChatbotMessage saveMessage(User user, String message, boolean sentByUser) {
        ChatbotMessage chatbotMessage = new ChatbotMessage();
        chatbotMessage.setUser(user);
        chatbotMessage.setMessage(message);
        chatbotMessage.setSentByUser(sentByUser);
        chatbotMessage.setTimestamp(LocalDateTime.now());
        return chatbotRepository.save(chatbotMessage);
    }

    public List<ChatbotMessage> getMessagesForUser(User user) {
        List<ChatbotMessage> messages = chatbotRepository.findByUserOrderByTimestampAsc(user);
        if (messages == null || messages.isEmpty()) {
            throw new CustomException("No chat history found for user.");
        }
        return messages;
    }

    public String getAIResponse(String userMessage) {
        Map<String, Object> requestBody = Map.of(
                "model", openrouterModel,
                "messages", List.of(Map.of("role", "user", "content", userMessage))
        );

        Mono<Map> responseMono = webClient.post()
                .uri(openrouterApiUrl)
                .header("Authorization", "Bearer " + openrouterApiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class);

        Map response;
        try {
            response = responseMono.block();
        } catch (Exception ex) {
            throw new CustomException("Error communicating with AI service: " + ex.getMessage());
        }

        if (response != null && response.containsKey("choices")) {
            List choices = (List) response.get("choices");
            if (!choices.isEmpty()) {
                Map firstChoice = (Map) choices.get(0);
                Map message = (Map) firstChoice.get("message");
                return message.get("content").toString().trim();
            }
        }

        throw new CustomException("AI did not return a response.");
    }
}
