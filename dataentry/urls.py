 
from django.urls import path
from .views import data_entry_view


urlpatterns = [
    path("api/data-entry/", data_entry_view),
]
