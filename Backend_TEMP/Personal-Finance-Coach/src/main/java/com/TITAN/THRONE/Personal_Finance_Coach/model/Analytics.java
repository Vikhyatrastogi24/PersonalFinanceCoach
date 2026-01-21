package com.TITAN.THRONE.Personal_Finance_Coach.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@Getter @Setter
@Table(name = "analytics")
public class Analytics
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private LocalDate date;
    private String type;

    private String dataJson;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
