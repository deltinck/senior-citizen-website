from django.contrib import admin
from .models import PatientProfile, Appointment, Medication, DailyRoutine, Task, GameScore

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'emergency_contact', 'emergency_phone', 'created_at')
    search_fields = ('name', 'emergency_contact', 'health_conditions')

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'doctor_name', 'consultation_type', 'appointment_date', 'appointment_time', 'status')
    list_filter = ('status', 'consultation_type', 'doctor_name')
    search_fields = ('patient_name', 'doctor_name', 'reason')

@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ('medicine_name', 'patient_name', 'dosage', 'frequency', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active', 'frequency')
    search_fields = ('medicine_name', 'patient_name', 'doctor_name')

@admin.register(DailyRoutine)
class DailyRoutineAdmin(admin.ModelAdmin):
    list_display = ('stage', 'time_str', 'activity', 'is_completed')
    list_filter = ('stage', 'is_completed')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('task_name', 'category', 'status', 'due_date')
    list_filter = ('category', 'status')

@admin.register(GameScore)
class GameScoreAdmin(admin.ModelAdmin):
    list_display = ('game_name', 'player_name', 'score', 'level', 'created_at')
    list_filter = ('game_name',)
