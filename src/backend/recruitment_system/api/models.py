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
