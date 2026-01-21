package com.TITAN.THRONE.Personal_Finance_Coach.service;

import com.TITAN.THRONE.Personal_Finance_Coach.dto.LoginRequest;
import com.TITAN.THRONE.Personal_Finance_Coach.dto.SignUpRequest;
import com.TITAN.THRONE.Personal_Finance_Coach.dto.UserDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.exception.CustomException;
import com.TITAN.THRONE.Personal_Finance_Coach.exception.ResourceNotFoundException;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(SignUpRequest signUpRequest) {
        userRepository.findByEmail(signUpRequest.getEmail())
                .ifPresent(u -> {
                    throw new CustomException("Email already registered");
                });

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setFullName(signUpRequest.getFullName());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole("USER"); // Set default role

        return userRepository.save(user);
    }

    public User authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new CustomException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid email or password");
        }
        return user;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public User updateUser(String email, UserDTO userDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setFullName(userDto.getFullName());
        // Add further profile fields update as needed

        return userRepository.save(user);
    }
}
