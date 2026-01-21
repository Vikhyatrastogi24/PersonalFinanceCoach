package com.TITAN.THRONE.Personal_Finance_Coach.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
@NoArgsConstructor
@Getter @Setter
@Entity
@Table(name = "budgets")
public class Budget
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id ;

    @Column(nullable = false)
    private String category;
    @Column(nullable = false)
    private BigDecimal targetAmount;
    private BigDecimal spentAmount = BigDecimal.ZERO;
    private LocalDate startDate;
    private LocalDate endDate;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user ;



}
