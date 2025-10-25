from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import UserProfile, JobRequest
from .serializers import UserSerializer, JobRequestSerializer


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
    # For testing purposes, we'll use the user with id=2 (the admin we created)
    data = request.data.copy()
    data["requested_by"] = 2  # Use the admin user ID

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
