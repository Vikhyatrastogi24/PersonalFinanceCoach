package com.TITAN.THRONE.Personal_Finance_Coach.service;

import com.TITAN.THRONE.Personal_Finance_Coach.exception.CustomException;
import com.TITAN.THRONE.Personal_Finance_Coach.exception.ResourceNotFoundException;
import com.TITAN.THRONE.Personal_Finance_Coach.model.Notification;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.repo.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Fetch notifications for a user ordered descending by timestamp
    public List<Notification> getNotificationsByUser(User user) {
        return notificationRepository.findByUserOrderByTimestampDesc(user);
    }

    // Mark a notification as read
    public Notification markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new CustomException("Unauthorized operation");
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    // Create a new notification
    public Notification createNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setTimestamp(LocalDateTime.now());
        return notificationRepository.save(notification);
    }
}
