package com.recruitment.system.data;

import com.recruitment.system.model.User;
import com.recruitment.system.model.UserRole;
import com.recruitment.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create test users if they don't exist
        if (userRepository.count() == 0) {
            createUser("admin", "admin123", "admin@company.com", UserRole.ADMIN);
            createUser("hr", "hr123", "hr@company.com", UserRole.HR);
            createUser("recruiter", "recruiter123", "recruiter@company.com", UserRole.RECRUITER);
            createUser("finalconfirmer", "final123", "final@company.com", UserRole.FINAL_CONFIRMER);
            
            System.out.println("Test users created successfully!");
        }
    }
    
    private void createUser(String username, String password, String email, UserRole role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole(role);
        userRepository.save(user);
    }
}
