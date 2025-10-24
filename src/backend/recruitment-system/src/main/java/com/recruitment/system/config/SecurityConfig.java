package com.recruitment.system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll()  // Allow H2 console access
                .requestMatchers("/error").permitAll()         // Allow error page
                .requestMatchers("/", "/home").permitAll()     // Allow home page
                .anyRequest().authenticated()                  // All other requests need authentication
            )
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/h2-console/**")     // Disable CSRF for H2 console
            )
            .headers(headers -> headers
                .frameOptions().disable()                      // Allow H2 console in iframe
            );
        
        return http.build();
    }
}
