from django.urls import path
from . import views

app_name = 'game'

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('register/', views.register, name='register'),
    path('rules/', views.rules, name='rules'),
    path('learning/', views.learning, name='learning'),
    path('game/', views.index, name='index'),
    path('api/questions/', views.api_questions, name='api_questions'),
    path('api/save-session/', views.api_save_session, name='api_save_session'),
    path('api/stats/', views.api_stats, name='api_stats'),
]
