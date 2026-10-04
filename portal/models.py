from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class UserAccount(models.Model):
    ROLE_CHOICES = [
        ('senior', 'Senior Citizen'),
        ('doctor', 'Doctor'),
    ]

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='senior')
    phone = models.CharField(max_length=50, blank=True, null=True)

    # Doctor specific fields
    specialty = models.CharField(max_length=150, blank=True, null=True, default='General Physician')
    hospital = models.CharField(max_length=200, blank=True, null=True, default='SageCare Medical Center')
    license_no = models.CharField(max_length=100, blank=True, null=True)

    # Senior citizen specific fields
    age = models.IntegerField(default=70, blank=True, null=True)
    address = models.CharField(max_length=300, blank=True, null=True)
    emergency_contact = models.CharField(max_length=200, blank=True, null=True)
    emergency_phone = models.CharField(max_length=50, blank=True, null=True)
    health_conditions = models.TextField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    photo_data = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.name} ({self.role}) - {self.email}"


class PatientProfile(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE, null=True, blank=True, related_name='patient_profile')
    name = models.CharField(max_length=200, default="Elderly Member")
    age = models.IntegerField(default=70)
    address = models.CharField(max_length=300, blank=True, null=True)
    emergency_contact = models.CharField(max_length=200, blank=True, null=True)
    emergency_phone = models.CharField(max_length=50, blank=True, null=True)
    health_conditions = models.TextField(blank=True, null=True)
    medications_summary = models.TextField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    photo_data = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (Age {self.age})"

class Appointment(models.Model):
    CONSULTATION_CHOICES = [
        ('In-Person', 'In-Person'),
        ('Online', 'Online'),
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    patient_name = models.CharField(max_length=200)
    patient_email = models.EmailField(blank=True, null=True)
    doctor_name = models.CharField(max_length=200)
    doctor_email = models.EmailField(blank=True, null=True)
    consultation_type = models.CharField(max_length=20, choices=CONSULTATION_CHOICES, default='Online')
    appointment_date = models.CharField(max_length=50) # flexible date string
    appointment_time = models.CharField(max_length=50)
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Confirmed')
    call_room_id = models.CharField(max_length=100, blank=True, null=True)
    doctor_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_name} with {self.doctor_name} on {self.appointment_date}"

class Medication(models.Model):
    patient_name = models.CharField(max_length=200, default="Patient")
    patient_email = models.EmailField(blank=True, null=True)
    medicine_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100) # e.g. Morning, Evening, Twice Daily
    start_date = models.CharField(max_length=50, blank=True, null=True)
    end_date = models.CharField(max_length=50, blank=True, null=True)
    doctor_name = models.CharField(max_length=200, blank=True, null=True)
    prescribed_by_email = models.EmailField(blank=True, null=True)
    instructions = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.medicine_name} ({self.dosage}) - {self.frequency}"

class DailyRoutine(models.Model):
    STAGE_CHOICES = [
        ('Morning', 'Morning'),
        ('Midday', 'Midday'),
        ('Evening', 'Evening'),
        ('Bedtime', 'Bedtime'),
    ]
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='Morning')
    time_str = models.CharField(max_length=50)
    activity = models.CharField(max_length=300)
    icon_symbol = models.CharField(max_length=50, default='📌')
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.stage}] {self.time_str} - {self.activity}"

class Task(models.Model):
    CATEGORY_CHOICES = [
        ('Work', 'Work'),
        ('Shopping', 'Shopping'),
        ('Personal', 'Personal'),
        ('Health', 'Health'),
    ]
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
    ]

    task_name = models.CharField(max_length=250)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Personal')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    due_date = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.task_name} ({self.status})"

class GameScore(models.Model):
    game_name = models.CharField(max_length=100)
    player_name = models.CharField(max_length=100, default="Senior Player")
    score = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.game_name} - {self.player_name}: {self.score} pts"
