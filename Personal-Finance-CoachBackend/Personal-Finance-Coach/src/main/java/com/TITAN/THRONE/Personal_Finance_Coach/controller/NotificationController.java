package com.TITAN.THRONE.Personal_Finance_Coach.controller;

import com.TITAN.THRONE.Personal_Finance_Coach.dto.NotificationDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.model.Notification;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.service.JwtTokenProvider;
import com.TITAN.THRONE.Personal_Finance_Coach.service.NotificationService;
import com.TITAN.THRONE.Personal_Finance_Coach.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setTimestamp(notification.getTimestamp());
        return dto;
    }

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(@RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        List<Notification> notifications = notificationService.getNotificationsByUser(user);
        List<NotificationDTO> dtos = notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@RequestHeader("Authorization") String token,
                                                      @PathVariable Long id) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        Notification updatedNotification = notificationService.markAsRead(id, user);
        NotificationDTO dto = convertToDTO(updatedNotification);
        return ResponseEntity.ok(dto);
    }
}
