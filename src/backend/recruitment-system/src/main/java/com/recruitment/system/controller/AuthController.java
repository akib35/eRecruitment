package com.recruitment.system.controller;

import com.recruitment.system.dto.LoginRequest;
import com.recruitment.system.dto.LoginResponse;
import com.recruitment.system.dto.RegisterRequest;
import com.recruitment.system.model.User;
import com.recruitment.system.model.UserRole;
import com.recruitment.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                LoginResponse response = new LoginResponse(user.getUsername(), user.getRole(), "Login successful");
                return ResponseEntity.ok(response);
            }
        }
        
        return ResponseEntity.badRequest().body("Invalid username or password");
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Check if user already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }
}
