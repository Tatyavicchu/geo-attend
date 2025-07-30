from django.urls import path
from . import views

urlpatterns = [
     path('generate-link/', views.generate_link, name='generate_link'),
    path('class-form/<str:session_id>/', views.class_form, name='class_form'),
    path('submit-attendance/', views.submit_attendance, name='submit_attendance'),
    path('attendance-list/<str:session_id>/', views.attendance_list, name='attendance_list'),
]
