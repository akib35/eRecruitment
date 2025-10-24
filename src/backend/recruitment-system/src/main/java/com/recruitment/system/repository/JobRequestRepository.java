package com.recruitment.system.repository;

import com.recruitment.system.model.JobRequest;
import com.recruitment.system.model.JobRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRequestRepository extends JpaRepository<JobRequest, Long> {
    List<JobRequest> findByStatus(JobRequestStatus status);
    List<JobRequest> findByRequestedByUserId(Long userId);
}
