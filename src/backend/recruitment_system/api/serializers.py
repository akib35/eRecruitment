from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, JobRequest, Candidate, Interview, ActionLog


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "password", "email")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data.get("email", ""),
        )
        return user


class JobRequestSerializer(serializers.ModelSerializer):
    requested_by_username = serializers.CharField(
        source="requested_by.username", read_only=True
    )

    class Meta:
        model = JobRequest
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")


class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")


class ActionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionLog
        fields = "__all__"
        read_only_fields = ("timestamp",)
