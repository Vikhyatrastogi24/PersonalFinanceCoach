package com.TITAN.THRONE.Personal_Finance_Coach.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter @Setter
@Table(name = "notifications")
public class Notification
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
@Column(name = "isRead")
    private boolean read = false;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

}
