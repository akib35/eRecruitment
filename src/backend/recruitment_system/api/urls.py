from django.urls import path
from . import views

urlpatterns = [
    path("auth/register/", views.register, name="register"),
    path("auth/login/", views.login, name="login"),
    path("recruiter/job-request/", views.create_job_request, name="create_job_request"),
    path(
        "hr/pending-requests/", views.get_pending_requests, name="get_pending_requests"
    ),
    path(
        "hr/job-request/<int:pk>/<str:action>/",
        views.update_job_request_status,
        name="update_job_request_status",
    ),
    path("hr/candidate/", views.create_candidate, name="create_candidate"),
    path(
        "hr/candidates/<int:job_id>/",
        views.get_candidates_for_job,
        name="get_candidates_for_job",
    ),
    path("hr/all-candidates/", views.get_all_candidates, name="get_all_candidates"),
    path(
        "hr/candidate/<int:candidate_id>/<str:status>/",
        views.update_candidate_status,
        name="update_candidate_status",
    ),
    path(
        "hr/candidate-selected/<int:candidate_id>/",
        views.update_candidate_status_to_selected,
        name="update_candidate_status_to_selected",
    ),
    path(
        "hr/candidate-accepted/<int:candidate_id>/",
        views.update_candidate_status_to_accepted,
        name="update_candidate_status_to_accepted",
    ),
    path("hr/interview/", views.create_interview, name="create_interview"),
    path(
        "hr/interviews/<int:candidate_id>/",
        views.get_interviews_for_candidate,
        name="get_interviews_for_candidate",
    ),
    path("hr/all-interviews/", views.get_all_interviews, name="get_all_interviews"),
    path("logs/", views.get_action_logs, name="get_action_logs"),
    path("summary/", views.get_summary_report, name="get_summary_report"),
]
