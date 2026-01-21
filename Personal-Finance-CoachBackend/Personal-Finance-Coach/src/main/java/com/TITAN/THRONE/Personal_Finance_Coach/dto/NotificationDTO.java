package com.TITAN.THRONE.Personal_Finance_Coach.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class NotificationDTO {
    private Long id;
    private String message;
    private boolean read;
    private LocalDateTime timestamp;


}
