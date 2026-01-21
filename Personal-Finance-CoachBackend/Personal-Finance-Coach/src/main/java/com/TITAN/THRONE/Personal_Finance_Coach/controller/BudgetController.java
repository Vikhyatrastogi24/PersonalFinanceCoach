package com.TITAN.THRONE.Personal_Finance_Coach.controller;

import com.TITAN.THRONE.Personal_Finance_Coach.dto.BudgetDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.model.Budget;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.service.BudgetService;
import com.TITAN.THRONE.Personal_Finance_Coach.service.JwtTokenProvider;
import com.TITAN.THRONE.Personal_Finance_Coach.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    // Helper to convert Budget entity to DTO
    private BudgetDTO convertToDTO(Budget budget) {
        BudgetDTO dto = new BudgetDTO();
        dto.setId(budget.getId());
        dto.setCategory(budget.getCategory());
        dto.setTargetAmount(budget.getTargetAmount());
        dto.setSpentAmount(budget.getSpentAmount());
        dto.setStartDate(budget.getStartDate());
        dto.setEndDate(budget.getEndDate());
        return dto;
    }

    private Budget convertToEntity(BudgetDTO dto, User user) {
        Budget budget = new Budget();
        budget.setId(dto.getId());
        budget.setCategory(dto.getCategory());
        budget.setTargetAmount(dto.getTargetAmount());
        budget.setSpentAmount(dto.getSpentAmount() != null ? dto.getSpentAmount() : null);
        budget.setStartDate(dto.getStartDate());
        budget.setEndDate(dto.getEndDate());
        budget.setUser(user);
        return budget;
    }

    // Create a new budget
    @PostMapping
    public ResponseEntity<BudgetDTO> createBudget(@RequestHeader("Authorization") String token,
                                                  @RequestBody BudgetDTO budgetDTO) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        Budget budget = convertToEntity(budgetDTO, user);
        Budget savedBudget = budgetService.createBudget(budget);

        return ResponseEntity.ok(convertToDTO(savedBudget));
    }

    // Get all budgets for logged-in user
    @GetMapping
    public ResponseEntity<List<BudgetDTO>> getBudgets(@RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        List<Budget> budgets = budgetService.getBudgetsByUser(user);
        List<BudgetDTO> dtos = budgets.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Update a budget
    @PutMapping("/{id}")
    public ResponseEntity<BudgetDTO> updateBudget(@RequestHeader("Authorization") String token,
                                                  @PathVariable Long id,
                                                  @RequestBody BudgetDTO budgetDTO) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        Budget updatedBudget = budgetService.updateBudget(id, budgetDTO, user);
        return ResponseEntity.ok(convertToDTO(updatedBudget));
    }

    // Delete a budget
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@RequestHeader("Authorization") String token,
                                             @PathVariable Long id) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        budgetService.deleteBudget(id, user);
        return ResponseEntity.noContent().build();
    }
}
