from django.urls import path
from .views import data_entry_view, task_status, data_export_view

urlpatterns = [
    path("api/data-entry/", data_entry_view),
    path("api/data-export/", data_export_view),
    path("api/task-status/", task_status),
]
