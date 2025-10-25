package com.recruitment.system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/", "/home", "/test-public").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/recruiter/**").permitAll()  // Allow recruiter endpoints
                .requestMatchers("/api/hr/**").permitAll()        // Allow HR endpoints
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/h2-console/**", "/api/auth/**", "/api/recruiter/**", "/api/hr/**")
            )
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.disable())
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
