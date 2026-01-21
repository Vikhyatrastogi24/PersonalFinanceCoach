package com.TITAN.THRONE.Personal_Finance_Coach.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardDTO {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal savings;
    private Map<String, BigDecimal> expensesByCategory;
    private Map<String, Object> additionalStats;  // For any other data you want to send

    // Getters and Setters

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getSavings() {
        return savings;
    }

    public void setSavings(BigDecimal savings) {
        this.savings = savings;
    }

    public Map<String, BigDecimal> getExpensesByCategory() {
        return expensesByCategory;
    }

    public void setExpensesByCategory(Map<String, BigDecimal> expensesByCategory) {
        this.expensesByCategory = expensesByCategory;
    }

    public Map<String, Object> getAdditionalStats() {
        return additionalStats;
    }

    public void setAdditionalStats(Map<String, Object> additionalStats) {
        this.additionalStats = additionalStats;
    }
}
