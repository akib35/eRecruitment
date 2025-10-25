package com.recruitment.system.dto;

import com.recruitment.system.model.UserRole;
import lombok.Data;

@Data
public class LoginResponse {
    private String username;
    private UserRole role;
    private String message;
    
    public LoginResponse(String username, UserRole role, String message) {
        this.username = username;
        this.role = role;
        this.message = message;
    }
}
