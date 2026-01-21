package com.TITAN.THRONE.Personal_Finance_Coach.dto;


import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SignUpRequest
{
    private String FullName;
    private String email;
    private String password;
}
