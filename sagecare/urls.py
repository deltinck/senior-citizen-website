from django.contrib import admin
from django.urls import path
from portal import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # HTML Page Routes
    path('', views.page_index, name='index'),
    path('index.html', views.page_index, name='index_html'),
    path('login.html', views.page_login, name='login'),
    path('signup.html', views.page_signup, name='signup'),
    path('services.html', views.page_services, name='services'),
    path('third.html', views.page_services, name='third_legacy'),
    path('health.html', views.page_health, name='health'),
    path('profile.html', views.page_profile, name='profile'),
    path('info.html', views.page_profile, name='info_legacy'),
    path('routine.html', views.page_routine, name='routine'),
    path('abc.html', views.page_routine, name='abc_legacy'),
    path('appointment.html', views.page_appointment, name='appointment'),
    path('four.html', views.page_appointment, name='four_legacy'),
    path('games.html', views.page_games, name='games'),
    path('game.html', views.page_games, name='game_legacy'),
    path('win.html', views.page_games, name='win_legacy'),
    path('tracker.html', views.page_tracker, name='tracker'),
    path('entertain.html', views.page_entertain, name='entertain'),
    path('about.html', views.page_about, name='about'),
    path('second.html', views.page_about, name='second_legacy'),

    # REST API Routes
    path('api/register/', views.api_register, name='api_register'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/doctors/', views.api_doctors, name='api_doctors'),
    path('api/patients/', views.api_patients, name='api_patients'),
    path('api/profile/', views.api_profile, name='api_profile'),
    path('api/appointments/', views.api_appointments, name='api_appointments'),
    path('api/appointments/<int:item_id>/', views.api_appointments, name='api_appointments_detail'),
    path('api/medications/', views.api_medications, name='api_medications'),
    path('api/medications/<int:item_id>/', views.api_medications, name='api_medications_detail'),
    path('api/routines/', views.api_routines, name='api_routines'),
    path('api/routines/<int:item_id>/', views.api_routines, name='api_routines_detail'),
    path('api/tasks/', views.api_tasks, name='api_tasks'),
    path('api/tasks/<int:item_id>/', views.api_tasks, name='api_tasks_detail'),
    path('api/scores/', views.api_scores, name='api_scores'),
]
