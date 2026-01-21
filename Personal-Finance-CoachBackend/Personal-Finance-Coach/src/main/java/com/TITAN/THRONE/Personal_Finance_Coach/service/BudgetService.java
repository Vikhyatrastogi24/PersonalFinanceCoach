package com.TITAN.THRONE.Personal_Finance_Coach.service;

import com.TITAN.THRONE.Personal_Finance_Coach.dto.BudgetDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.exception.CustomException;
import com.TITAN.THRONE.Personal_Finance_Coach.exception.ResourceNotFoundException;
import com.TITAN.THRONE.Personal_Finance_Coach.model.Budget;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.repo.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public Budget createBudget(Budget budget) {
        // Additional validation can be added here
        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgetsByUser(User user) {
        return budgetRepository.findByUser(user);
    }

    public Budget updateBudget(Long id, BudgetDTO budgetDTO, User user) {
        Budget existingBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        if (!existingBudget.getUser().getId().equals(user.getId())) {
            throw new CustomException("Unauthorized to update this budget");
        }

        existingBudget.setCategory(budgetDTO.getCategory());
        existingBudget.setTargetAmount(budgetDTO.getTargetAmount());
        existingBudget.setSpentAmount(budgetDTO.getSpentAmount());
        existingBudget.setStartDate(budgetDTO.getStartDate());
        existingBudget.setEndDate(budgetDTO.getEndDate());

        return budgetRepository.save(existingBudget);
    }

    public void deleteBudget(Long id, User user) {
        Budget existingBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        if (!existingBudget.getUser().getId().equals(user.getId())) {
            throw new CustomException("Unauthorized to delete this budget");
        }

        budgetRepository.delete(existingBudget);
    }
}

