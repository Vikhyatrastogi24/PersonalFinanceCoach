package com.TITAN.THRONE.Personal_Finance_Coach.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor
public class TransactionDTO {
    private Long id;
    private String description;
    private String category;
    private BigDecimal amount;
    private LocalDate date;


}
