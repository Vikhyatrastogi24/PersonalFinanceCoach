package com.TITAN.THRONE.Personal_Finance_Coach.service;

import com.TITAN.THRONE.Personal_Finance_Coach.dto.DashboardDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.exception.ResourceNotFoundException;
import com.TITAN.THRONE.Personal_Finance_Coach.model.Analytics;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.repo.AnalyticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    public List<Analytics> getAnalyticsByUser(User user) {
        List<Analytics> analyticsList = analyticsRepository.findByUser(user);
        if (analyticsList == null || analyticsList.isEmpty()) {
            throw new ResourceNotFoundException("No analytics data found for user");
        }
        return analyticsList;
    }

    // For flexibility, you can add method to save new analytics snapshots
    public Analytics saveAnalytics(Analytics analytics) {
        return analyticsRepository.save(analytics);
    }

    // New method to build dashboard data for a user
    public DashboardDTO getDashboardDataForUser(User user) {
        List<Analytics> analyticsList = analyticsRepository.findByUser(user);

        // Return empty DTO if no analytics found instead of throwing exception
        if (analyticsList == null || analyticsList.isEmpty()) {
            return new DashboardDTO();  // empty DTO with default null/zero fields
        }

        DashboardDTO dashboardDTO = new DashboardDTO();

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;
        Map<String, BigDecimal> expensesByCategory = new HashMap<>();

        for (Analytics analytics : analyticsList) {
            if ("INCOME".equalsIgnoreCase(analytics.getType())) {
                totalIncome = totalIncome.add(parseAmountFromDataJson(analytics.getDataJson()));
            } else if ("EXPENSE".equalsIgnoreCase(analytics.getType())) {
                BigDecimal amount = parseAmountFromDataJson(analytics.getDataJson());
                totalExpenses = totalExpenses.add(amount);
                String category = parseCategoryFromDataJson(analytics.getDataJson());
                expensesByCategory.put(category, expensesByCategory.getOrDefault(category, BigDecimal.ZERO).add(amount));
            }
        }

        dashboardDTO.setTotalIncome(totalIncome);
        dashboardDTO.setTotalExpenses(totalExpenses);
        dashboardDTO.setSavings(totalIncome.subtract(totalExpenses));
        dashboardDTO.setExpensesByCategory(expensesByCategory);
        dashboardDTO.setAdditionalStats(new HashMap<>());

        return dashboardDTO;
    }


    // Helper methods to parse the amount and category from your stored JSON string
    private BigDecimal parseAmountFromDataJson(String dataJson) {
        // TODO: Implement JSON parsing based on the format stored in dataJson
        // Example placeholder implementation:
        // Assume dataJson is a JSON string with a field "amount"
        try {
            // Use your preferred JSON library, e.g. Jackson or org.json
            // Here is a pseudo-code example:
            // JSONObject json = new JSONObject(dataJson);
            // return json.getBigDecimal("amount");
            return new BigDecimal("0"); // placeholder, replace this
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    private String parseCategoryFromDataJson(String dataJson) {
        // TODO: Implement JSON parsing to extract category
        // Example placeholder implementation:
        return "Uncategorized"; // placeholder, replace this
    }
}
