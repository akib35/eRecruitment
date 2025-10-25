from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, JobRequest


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
