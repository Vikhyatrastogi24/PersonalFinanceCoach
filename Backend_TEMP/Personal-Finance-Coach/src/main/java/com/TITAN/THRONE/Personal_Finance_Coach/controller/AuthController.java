package com.TITAN.THRONE.Personal_Finance_Coach.controller;

import com.TITAN.THRONE.Personal_Finance_Coach.dto.AuthResponse;
import com.TITAN.THRONE.Personal_Finance_Coach.dto.LoginRequest;
import com.TITAN.THRONE.Personal_Finance_Coach.dto.SignUpRequest;
import com.TITAN.THRONE.Personal_Finance_Coach.dto.UserDTO;
import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import com.TITAN.THRONE.Personal_Finance_Coach.service.JwtTokenProvider;
import com.TITAN.THRONE.Personal_Finance_Coach.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignUpRequest request) {
        User user = userService.registerUser(request);
        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole());

        AuthResponse resp = new AuthResponse();
        resp.setToken(token);
        resp.setUserId(user.getId());
        resp.setEmail(user.getEmail());
        resp.setFullName(user.getFullName());

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        User user = userService.authenticateUser(request);
        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole());

        AuthResponse resp = new AuthResponse();
        resp.setToken(token);
        resp.setUserId(user.getId());
        resp.setEmail(user.getEmail());
        resp.setFullName(user.getFullName());

        return ResponseEntity.ok(resp);
    }

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

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(@RequestHeader("Authorization") String token,
                                                 @RequestBody UserDTO userDto) {
        String email = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        User updatedUser = userService.updateUser(email, userDto);

        UserDTO resp = new UserDTO();
        resp.setId(updatedUser.getId());
        resp.setEmail(updatedUser.getEmail());
        resp.setFullName(updatedUser.getFullName());

        return ResponseEntity.ok(resp);
    }
}
