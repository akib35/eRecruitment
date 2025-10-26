from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import UserProfile, JobRequest, Candidate, Interview, ActionLog
from .serializers import (
    UserSerializer,
    JobRequestSerializer,
    CandidateSerializer,
    InterviewSerializer,
    ActionLogSerializer
)


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Create user profile
        role = request.data.get("role", "RECRUITER")
        UserProfile.objects.create(user=user, role=role)
        return Response(
            {"message": "User created successfully"}, status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user:
        try:
            profile = UserProfile.objects.get(user=user)
            return Response(
                {
                    "id": user.id,
                    "username": user.username,
                    "role": profile.role,
                    "message": "Login successful",
                }
            )
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "Profile not found"}, status=status.HTTP_400_BAD_REQUEST
            )
    return Response(
        {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["POST"])
@permission_classes([AllowAny])  # For testing
def create_job_request(request):
    data = request.data.copy()
    data["requested_by"] = 2  # Use the admin user ID for testing
    serializer = JobRequestSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])  # For testing
def get_pending_requests(request):
    pending_requests = JobRequest.objects.filter(status="PENDING_HR_APPROVAL")
    serializer = JobRequestSerializer(pending_requests, many=True)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([AllowAny])  # For testing
def update_job_request_status(request, pk, action):
    try:
        job_request = JobRequest.objects.get(pk=pk)
        if action.lower() == "approve":
            job_request.status = (
                "APPROVED" if job_request.status == "PENDING_HR_APPROVAL" else "OPEN"
            )
        elif action.lower() == "reject":
            job_request.status = "REJECTED"
        job_request.save()
        serializer = JobRequestSerializer(job_request)
        return Response(serializer.data)
    except JobRequest.DoesNotExist:
        return Response(
            {"error": "Job request not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
@permission_classes([AllowAny])  # For testing
def create_candidate(request):
    serializer = CandidateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])  # For testing
def get_candidates_for_job(request, job_id):
    candidates = Candidate.objects.filter(job_request_id=job_id)
    serializer = CandidateSerializer(candidates, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])  # For testing
def get_all_candidates(request):
    candidates = Candidate.objects.all()
    serializer = CandidateSerializer(candidates, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([AllowAny])  # For testing
def create_interview(request):
    serializer = InterviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])  # For testing
def get_interviews_for_candidate(request, candidate_id):
    interviews = Interview.objects.filter(candidate_id=candidate_id)
    serializer = InterviewSerializer(interviews, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])  # For testing
def get_all_interviews(request):
    interviews = Interview.objects.all()
    serializer = InterviewSerializer(interviews, many=True)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([AllowAny])  # For testing
def update_candidate_status(request, candidate_id, status):
    try:
        candidate = Candidate.objects.get(pk=candidate_id)
        candidate.status = status.upper()
        candidate.save()
        serializer = CandidateSerializer(candidate)
        return Response(serializer.data)
    except Candidate.DoesNotExist:
        return Response(
            {"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["PUT"])
@permission_classes([AllowAny])  # For testing
def update_candidate_status_to_selected(request, candidate_id):
    try:
        candidate = Candidate.objects.get(pk=candidate_id)
        candidate.status = "SELECTED"
        candidate.save()

        # Create action log
        user = User.objects.get(id=2)  # Use admin user for testing
        ActionLog.objects.create(
            user=user,
            action="CANDIDATE_SELECTED",
            description=f"Candidate {candidate.name} selected for {candidate.job_request.position}",
        )

        serializer = CandidateSerializer(candidate)
        return Response(serializer.data)
    except Candidate.DoesNotExist:
        return Response(
            {"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["PUT"])
@permission_classes([AllowAny])  # For testing
def update_candidate_status_to_accepted(request, candidate_id):
    try:
        candidate = Candidate.objects.get(pk=candidate_id)
        candidate.status = "ACCEPTED"
        candidate.save()

        # Create action log
        user = User.objects.get(id=2)  # Use admin user for testing
        ActionLog.objects.create(
            user=user,
            action="CANDIDATE_ACCEPTED",
            description=f"Candidate {candidate.name} accepted offer for {candidate.job_request.position}",
        )

        # Update job request status to closed
        job_request = candidate.job_request
        job_request.status = "CLOSED"
        job_request.save()

        serializer = CandidateSerializer(candidate)
        return Response(serializer.data)
    except Candidate.DoesNotExist:
        return Response(
            {"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["GET"])
@permission_classes([AllowAny])  # For testing
def get_action_logs(request):
    logs = ActionLog.objects.all().order_by("-timestamp")
    serializer = ActionLogSerializer(logs, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])  # For testing
def get_summary_report(request):
    # Get all closed job requests with accepted candidates
    closed_requests = JobRequest.objects.filter(status="CLOSED")
    summary_data = []

    for request in closed_requests:
        candidates = request.candidates.filter(status="ACCEPTED")
        for candidate in candidates:
            summary_data.append(
                {
                    "job_position": request.position,
                    "job_department": request.department,
                    "candidate_name": candidate.name,
                    "candidate_email": candidate.email,
                    "status": candidate.status,
                    "created_at": request.created_at,
                    "updated_at": request.updated_at,
                }
            )

    return Response(summary_data)
