from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ("ADMIN", "Admin"),
        ("HR", "HR"),
        ("RECRUITER", "Recruiter"),
        ("FINAL_CONFIRMER", "Final Confirmer"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class JobRequest(models.Model):
    STATUS_CHOICES = [
        ("PENDING_HR_APPROVAL", "Pending HR Approval"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("OPEN", "Open"),
        ("CLOSED", "Closed"),
    ]

    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    justification = models.TextField()
    number_of_openings = models.IntegerField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="PENDING_HR_APPROVAL"
    )
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.position} - {self.department}"


class Candidate(models.Model):
    CANDIDATE_STATUS_CHOICES = [
        ("NEW", "New"),
        ("SHORTLISTED", "Shortlisted"),
        ("REJECTED", "Rejected"),
        ("INTERVIEW_SCHEDULED", "Interview Scheduled"),
        ("SELECTED", "Selected"),
        ("REJECTED_AFTER_INTERVIEW", "Rejected After Interview"),
        ("HOLD", "Hold"),
        ("ACCEPTED", "Accepted"),
        ("CONFIRMED", "Confirmed"),
    ]

    job_request = models.ForeignKey(
        JobRequest, on_delete=models.CASCADE, related_name="candidates"
    )
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    source = models.CharField(max_length=100)  # e.g., LinkedIn, BDJobs
    status = models.CharField(
        max_length=24, choices=CANDIDATE_STATUS_CHOICES, default="NEW"
    )
    cv_file = models.FileField(
        upload_to="cvs/", null=True, blank=True
    )  # For future use
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.job_request.position}"


class Interview(models.Model):
    INTERVIEW_STATUS_CHOICES = [
        ("SCHEDULED", "Scheduled"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    candidate = models.ForeignKey(
        Candidate, on_delete=models.CASCADE, related_name="interviews"
    )
    scheduled_datetime = models.DateTimeField()
    interviewer = models.CharField(max_length=100)  # Could be a User field later
    notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=INTERVIEW_STATUS_CHOICES, default="SCHEDULED"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Interview for {self.candidate.name} on {self.scheduled_datetime}"


class ActionLog(models.Model):
    ACTION_CHOICES = [
        ("JOB_REQUEST_CREATED", "Job Request Created"),
        ("JOB_REQUEST_APPROVED", "Job Request Approved"),
        ("JOB_REQUEST_REJECTED", "Job Request Rejected"),
        ("CANDIDATE_ADDED", "Candidate Added"),
        ("CANDIDATE_SHORTLISTED", "Candidate Shortlisted"),
        ("CANDIDATE_REJECTED", "Candidate Rejected"),
        ("INTERVIEW_SCHEDULED", "Interview Scheduled"),
        ("INTERVIEW_COMPLETED", "Interview Completed"),
        ("CANDIDATE_SELECTED", "Candidate Selected"),
        ("CANDIDATE_ACCEPTED", "Candidate Accepted"),
        ("HIRING_CONFIRMED", "Hiring Confirmed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.timestamp}"
