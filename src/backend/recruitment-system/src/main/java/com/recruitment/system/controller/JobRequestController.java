package com.recruitment.system.controller;

import com.recruitment.system.model.JobRequest;
import com.recruitment.system.model.JobRequestStatus;
import com.recruitment.system.model.User;
import com.recruitment.system.repository.JobRequestRepository;
import com.recruitment.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class JobRequestController {
    
    @Autowired
    private JobRequestRepository jobRequestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Recruiter creates job request
    @PostMapping("/recruiter/job-request")
    public ResponseEntity<?> createJobRequest(@RequestBody JobRequest request) {
        // In a real app, you'd get the current user from authentication
        // For now, we'll use a hardcoded user ID (we'll create one later)
        request.setStatus(JobRequestStatus.PENDING_HR_APPROVAL);
        request.setRequestedByUserId(1L); // Will be replaced with actual user ID
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        
        JobRequest savedRequest = jobRequestRepository.save(request);
        return ResponseEntity.ok(savedRequest);
    }
    
    // HR views pending requests
    @GetMapping("/hr/pending-requests")
    public ResponseEntity<List<JobRequest>> getPendingRequests() {
        List<JobRequest> pendingRequests = jobRequestRepository.findByStatus(JobRequestStatus.PENDING_HR_APPROVAL);
        return ResponseEntity.ok(pendingRequests);
    }
    
    // HR approves or rejects a request
    @PutMapping("/hr/job-request/{id}/{action}")
    public ResponseEntity<?> updateJobRequestStatus(@PathVariable Long id, @PathVariable String action) {
        return jobRequestRepository.findById(id).map(request -> {
            if ("approve".equalsIgnoreCase(action)) {
                request.setStatus(JobRequestStatus.APPROVED);
            } else if ("reject".equalsIgnoreCase(action)) {
                request.setStatus(JobRequestStatus.REJECTED);
            }
            request.setUpdatedAt(LocalDateTime.now());
            JobRequest updatedRequest = jobRequestRepository.save(request);
            return ResponseEntity.ok(updatedRequest);
        }).orElse(ResponseEntity.notFound().build());
    }
}
