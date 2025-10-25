from django.urls import path
from . import views

urlpatterns = [
    path("auth/register/", views.register, name="register"),
    path("auth/login/", views.login, name="login"),
    path("recruiter/job-request/", views.create_job_request, name="create_job_request"),
    path(
        "hr/pending-requests/", views.get_pending_requests, name="get_pending_requests"
    ),
]
