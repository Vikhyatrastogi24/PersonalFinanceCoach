package com.TITAN.THRONE.Personal_Finance_Coach.repo;

import com.TITAN.THRONE.Personal_Finance_Coach.model.Budget;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BudgetRepository extends JpaRepository<Budget , Long>
{
    List<Budget> findByUser(User user);
}
