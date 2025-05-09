package com.github.dolmitya.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
public class UserResponse {
    private String username;
    private Double balance;
    private List<String> roles;
}
