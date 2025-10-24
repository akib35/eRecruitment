package com.recruitment.system.repository;

import com.recruitment.system.model.User;
import com.recruitment.system.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndRole(String username, UserRole role);
}
