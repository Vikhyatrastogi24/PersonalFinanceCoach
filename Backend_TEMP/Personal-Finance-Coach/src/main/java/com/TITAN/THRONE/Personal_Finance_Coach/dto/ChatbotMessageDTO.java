package com.TITAN.THRONE.Personal_Finance_Coach.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class ChatbotMessageDTO {
    private Long id;
    private String message;
    private boolean sentByUser;
    private LocalDateTime timestamp;


}
