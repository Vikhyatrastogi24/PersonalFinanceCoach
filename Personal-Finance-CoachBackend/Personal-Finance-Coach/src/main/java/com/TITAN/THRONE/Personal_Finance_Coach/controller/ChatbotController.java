package com.TITAN.THRONE.Personal_Finance_Coach.controller;

import com.TITAN.THRONE.Personal_Finance_Coach.dto.ChatbotMessageDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.model.ChatbotMessage;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.service.ChatbotService;
import com.TITAN.THRONE.Personal_Finance_Coach.service.JwtTokenProvider;
import com.TITAN.THRONE.Personal_Finance_Coach.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    // Convert entity to DTO
    private ChatbotMessageDTO convertToDTO(ChatbotMessage chat) {
        ChatbotMessageDTO dto = new ChatbotMessageDTO();
        dto.setId(chat.getId());
        dto.setMessage(chat.getMessage());
        dto.setSentByUser(chat.isSentByUser());
        dto.setTimestamp(chat.getTimestamp());
        return dto;
    }

    // Endpoint to send a message and get AI response
    @PostMapping("/message")
    public ResponseEntity<ChatbotMessageDTO> sendMessage(@RequestHeader("Authorization") String token,
                                                         @RequestBody ChatbotMessageDTO messageDTO) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        // Save user's message
        ChatbotMessage userMsg = chatbotService.saveMessage(user, messageDTO.getMessage(), true);

        // Get AI response from OpenRouter API
        String botResponse = chatbotService.getAIResponse(messageDTO.getMessage());

        // Save AI's response message
        ChatbotMessage botMsg = chatbotService.saveMessage(user, botResponse, false);

        // Return bot's response DTO so frontend can display it
        ChatbotMessageDTO responseDTO = convertToDTO(botMsg);
        return ResponseEntity.ok(responseDTO);
    }

    // Endpoint to fetch chat history for the user
    @GetMapping("/history")
    public ResponseEntity<List<ChatbotMessageDTO>> getChatHistory(@RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        List<ChatbotMessage> messages = chatbotService.getMessagesForUser(user);
        List<ChatbotMessageDTO> dtos = messages.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
