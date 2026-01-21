package com.TITAN.THRONE.Personal_Finance_Coach.repo;

import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User , Long>
{
    Optional<User> findByEmail(String email);
}
