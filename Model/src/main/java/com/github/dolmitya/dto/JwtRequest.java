package com.github.dolmitya.dto;

import lombok.Data;

@Data
public class JwtRequest {
    private String username;
    private String password;
}
