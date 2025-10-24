package com.recruitment.system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "job_requests")
public class JobRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String position;
    private String department;
    private String justification;
    private Integer numberOfOpenings;
    
    @Enumerated(EnumType.STRING)
    private JobRequestStatus status;
    
    private Long requestedByUserId;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
