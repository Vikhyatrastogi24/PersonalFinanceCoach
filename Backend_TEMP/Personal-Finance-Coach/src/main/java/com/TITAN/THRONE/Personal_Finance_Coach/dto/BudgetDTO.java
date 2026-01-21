package com.TITAN.THRONE.Personal_Finance_Coach.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
@Getter @Setter
@NoArgsConstructor
public class BudgetDTO {
    private Long id;
    @NotBlank(message = "category is required")
    private String category;

    @NotNull(message = "Target amount is required ")
    @Positive(message = "Target amount must be positive")
    @JsonProperty("target_amount")
    private BigDecimal targetAmount;
    private BigDecimal spentAmount;
    private LocalDate startDate;
    private LocalDate endDate;


}
