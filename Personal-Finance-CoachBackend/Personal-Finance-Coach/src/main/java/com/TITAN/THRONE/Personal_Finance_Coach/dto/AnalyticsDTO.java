package com.TITAN.THRONE.Personal_Finance_Coach.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class AnalyticsDTO {
    private Long id;
    private LocalDate date;
    private String type;  // e.g., "MONTHLY_SUMMARY"
    private String dataJson;  // Store analytics as JSON string

}
