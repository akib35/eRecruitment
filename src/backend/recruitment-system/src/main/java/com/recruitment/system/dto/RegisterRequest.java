package com.recruitment.system.dto;

import com.recruitment.system.model.UserRole;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private UserRole role;
}
