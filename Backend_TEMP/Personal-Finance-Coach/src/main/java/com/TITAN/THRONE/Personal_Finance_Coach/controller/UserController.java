package com.TITAN.THRONE.Personal_Finance_Coach.controller;

import com.TITAN.THRONE.Personal_Finance_Coach.dto.UserDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.service.JwtTokenProvider;
import com.TITAN.THRONE.Personal_Finance_Coach.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    // Get current user's profile
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getProfile(@RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User user = userService.getByEmail(email);

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());

        return ResponseEntity.ok(dto);
    }

    // Update current user's profile
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(@RequestHeader("Authorization") String token,
                                                 @RequestBody UserDTO userDto) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User updatedUser = userService.updateUser(email, userDto);

        UserDTO dto = new UserDTO();
        dto.setId(updatedUser.getId());
        dto.setEmail(updatedUser.getEmail());
        dto.setFullName(updatedUser.getFullName());

        return ResponseEntity.ok(dto);
    }
}
