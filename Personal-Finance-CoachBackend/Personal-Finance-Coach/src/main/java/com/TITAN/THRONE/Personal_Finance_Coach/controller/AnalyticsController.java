package com.TITAN.THRONE.Personal_Finance_Coach.controller;

import com.TITAN.THRONE.Personal_Finance_Coach.dto.AnalyticsDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.dto.DashboardDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.model.Analytics;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.service.AnalyticsService;
import com.TITAN.THRONE.Personal_Finance_Coach.service.JwtTokenProvider;
import com.TITAN.THRONE.Personal_Finance_Coach.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    private AnalyticsDTO convertToDTO(Analytics analytics) {
        AnalyticsDTO dto = new AnalyticsDTO();
        dto.setId(analytics.getId());
        dto.setDate(analytics.getDate());
        dto.setType(analytics.getType());
        dto.setDataJson(analytics.getDataJson());
        return dto;
    }

    @GetMapping
    public ResponseEntity<List<AnalyticsDTO>> getAnalytics(@RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        List<Analytics> analyticsList = analyticsService.getAnalyticsByUser(user);
        List<AnalyticsDTO> dtos = analyticsList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // New endpoint for /dashboard data
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboardData(@RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        // Fetch the dashboard data for the user from service
        DashboardDTO dashboardData = analyticsService.getDashboardDataForUser(user);

        return ResponseEntity.ok(dashboardData);
    }
}
