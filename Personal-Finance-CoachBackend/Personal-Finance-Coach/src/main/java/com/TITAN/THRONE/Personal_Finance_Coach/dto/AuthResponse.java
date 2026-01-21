package com.TITAN.THRONE.Personal_Finance_Coach.dto;


import com.TITAN.THRONE.Personal_Finance_Coach.model.User;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AuthResponse
{
    private String token;
    private Long userId;
    private String email;
    private String fullName;
}
