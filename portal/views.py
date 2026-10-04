import json
import uuid
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserAccount, PatientProfile, Appointment, Medication, DailyRoutine, Task, GameScore

# --- HTML Template Page Views (Legacy Support) ---
def page_index(request):
    return render(request, 'index.html')

def page_login(request):
    return render(request, 'login.html')

def page_signup(request):
    return render(request, 'signup.html')

def page_services(request):
    return render(request, 'services.html')

def page_health(request):
    return render(request, 'health.html')

def page_profile(request):
    return render(request, 'profile.html')

def page_routine(request):
    return render(request, 'routine.html')

def page_appointment(request):
    return render(request, 'appointment.html')

def page_games(request):
    return render(request, 'games.html')

def page_tracker(request):
    return render(request, 'tracker.html')

def page_entertain(request):
    return render(request, 'entertain.html')

def page_about(request):
    return render(request, 'about.html')


# --- REST API Endpoints ---

@csrf_exempt
def api_register(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'POST method required'}, status=405)

    try:
        data = json.loads(request.body)
    except Exception:
        data = request.POST

    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    name = data.get('name', '').strip()
    role = data.get('role', 'senior').strip().lower()

    if not email or not password or not name:
        return JsonResponse({'status': 'error', 'message': 'Name, email, and password are required'}, status=400)

    if UserAccount.objects.filter(email=email).exists():
        return JsonResponse({'status': 'error', 'message': 'An account with this email already exists'}, status=400)

    account = UserAccount(
        email=email,
        name=name,
        role=role,
        phone=data.get('phone', ''),
    )
    account.set_password(password)

    if role == 'doctor':
        account.specialty = data.get('specialty', 'General Physician')
        account.hospital = data.get('hospital', 'SageCare Medical Center')
        account.license_no = data.get('license_no', 'MD-' + uuid.uuid4().hex[:6].upper())
    else:
        # Senior Citizen
        account.age = int(data.get('age', 70)) if data.get('age') else 70
        account.address = data.get('address', '')
        account.emergency_contact = data.get('emergency_contact', '')
        account.emergency_phone = data.get('emergency_phone', '')
        account.health_conditions = data.get('health_conditions', '')
        account.allergies = data.get('allergies', '')
        account.photo_data = data.get('photo_data', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80')

    account.save()

    # If senior citizen, sync to PatientProfile
    if role == 'senior':
        PatientProfile.objects.update_or_create(
            user=account,
            defaults={
                'name': account.name,
                'age': account.age or 70,
                'address': account.address,
                'emergency_contact': account.emergency_contact,
                'emergency_phone': account.emergency_phone,
                'health_conditions': account.health_conditions,
                'allergies': account.allergies,
                'photo_data': account.photo_data
            }
        )

    user_info = {
        'id': account.id,
        'email': account.email,
        'name': account.name,
        'role': account.role,
        'phone': account.phone,
        'specialty': account.specialty,
        'hospital': account.hospital,
        'age': account.age,
        'emergency_contact': account.emergency_contact,
        'emergency_phone': account.emergency_phone,
        'health_conditions': account.health_conditions,
        'allergies': account.allergies,
        'photo_data': account.photo_data,
    }

    return JsonResponse({'status': 'success', 'user': user_info})


@csrf_exempt
def api_login(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'POST method required'}, status=405)

    try:
        data = json.loads(request.body)
    except Exception:
        data = request.POST

    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return JsonResponse({'status': 'error', 'message': 'Email and password required'}, status=400)

    try:
        account = UserAccount.objects.get(email=email)
    except UserAccount.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)

    if not account.check_password(password):
        return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)

    user_info = {
        'id': account.id,
        'email': account.email,
        'name': account.name,
        'role': account.role,
        'phone': account.phone,
        'specialty': account.specialty,
        'hospital': account.hospital,
        'age': account.age,
        'address': account.address,
        'emergency_contact': account.emergency_contact,
        'emergency_phone': account.emergency_phone,
        'health_conditions': account.health_conditions,
        'allergies': account.allergies,
        'photo_data': account.photo_data,
    }

    return JsonResponse({'status': 'success', 'user': user_info})


@csrf_exempt
def api_doctors(request):
    doctors = list(UserAccount.objects.filter(role='doctor').values(
        'id', 'name', 'email', 'phone', 'specialty', 'hospital', 'license_no'
    ))
    return JsonResponse({'status': 'success', 'data': doctors})


@csrf_exempt
def api_patients(request):
    patients = list(UserAccount.objects.filter(role='senior').values(
        'id', 'name', 'email', 'phone', 'age', 'address', 
        'emergency_contact', 'emergency_phone', 'health_conditions', 'allergies', 'photo_data'
    ))
    # If no patients in UserAccount yet, fallback to PatientProfile
    if not patients:
        profiles = list(PatientProfile.objects.all().values())
        return JsonResponse({'status': 'success', 'data': profiles})
    return JsonResponse({'status': 'success', 'data': patients})


@csrf_exempt
def api_profile(request):
    if request.method == 'GET':
        email = request.GET.get('email')
        if email:
            account = UserAccount.objects.filter(email=email).first()
            if account:
                return JsonResponse({
                    'id': account.id,
                    'name': account.name,
                    'email': account.email,
                    'role': account.role,
                    'age': account.age,
                    'address': account.address,
                    'emergency_contact': account.emergency_contact,
                    'emergency_phone': account.emergency_phone,
                    'health_conditions': account.health_conditions,
                    'allergies': account.allergies,
                    'photo_data': account.photo_data,
                })

        profile = PatientProfile.objects.order_by('-created_at').first()
        if not profile:
            profile = PatientProfile.objects.create(
                name="Arthur Pendelton",
                age=74,
                address="42 Whispering Pines Lane, Brookside Gardens, CA 90210",
                emergency_contact="Eleanor Pendelton (Daughter)",
                emergency_phone="+1 (555) 234-5678",
                health_conditions="Mild Hypertension, Osteoarthritis in knees",
                medications_summary="Amlodipine 5mg (Daily morning), Glucosamine (Noon)",
                allergies="Penicillin, Sulfa drugs",
                photo_data="https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80"
            )
        return JsonResponse({
            'id': profile.id,
            'name': profile.name,
            'age': profile.age,
            'address': profile.address,
            'emergency_contact': profile.emergency_contact,
            'emergency_phone': profile.emergency_phone,
            'health_conditions': profile.health_conditions,
            'medications_summary': profile.medications_summary,
            'allergies': profile.allergies,
            'photo_data': profile.photo_data,
        })

    elif request.method in ['POST', 'PUT']:
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        profile = PatientProfile.objects.order_by('-created_at').first()
        if not profile:
            profile = PatientProfile()

        profile.name = data.get('name', profile.name or 'Arthur Pendelton')
        if data.get('age') is not None:
            try:
                profile.age = int(data.get('age'))
            except (ValueError, TypeError):
                pass
        profile.address = data.get('address', profile.address)
        profile.emergency_contact = data.get('emergency_contact', data.get('contact1', profile.emergency_contact))
        profile.emergency_phone = data.get('emergency_phone', data.get('contact1_phone', profile.emergency_phone))
        profile.health_conditions = data.get('health_conditions', data.get('conditions', profile.health_conditions))
        profile.medications_summary = data.get('medications_summary', data.get('medications', profile.medications_summary))
        profile.allergies = data.get('allergies', profile.allergies)
        if data.get('photo_data'):
            profile.photo_data = data.get('photo_data')
        profile.save()

        return JsonResponse({'status': 'success', 'id': profile.id})


@csrf_exempt
def api_appointments(request, item_id=None):
    if request.method == 'GET':
        doctor_email = request.GET.get('doctor_email')
        patient_email = request.GET.get('patient_email')

        qs = Appointment.objects.all()
        if doctor_email:
            qs = qs.filter(doctor_email=doctor_email)
        elif patient_email:
            qs = qs.filter(patient_email=patient_email)

        appointments = list(qs.order_by('-created_at').values())
        return JsonResponse({'status': 'success', 'data': appointments})

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        # Create unique video call room ID if not present
        room_id = data.get('call_room_id') or ('room_' + uuid.uuid4().hex[:8])

        appt = Appointment.objects.create(
            patient_name=data.get('patient_name', data.get('patientName', 'Arthur Pendelton')),
            patient_email=data.get('patient_email', data.get('patientEmail', '')),
            doctor_name=data.get('doctor_name', data.get('doctor', 'Dr. Sarah Mitchell')),
            doctor_email=data.get('doctor_email', ''),
            consultation_type=data.get('consultation_type', data.get('consultationType', 'Online')),
            appointment_date=data.get('appointment_date', data.get('appointmentDate', '')),
            appointment_time=data.get('appointment_time', data.get('appointmentTime', '')),
            reason=data.get('reason', ''),
            status=data.get('status', 'Confirmed'),
            call_room_id=room_id,
            doctor_notes=data.get('doctor_notes', '')
        )
        return JsonResponse({'status': 'success', 'id': appt.id, 'call_room_id': room_id})

    elif request.method == 'PUT' and item_id:
        try:
            data = json.loads(request.body)
        except Exception:
            data = {}
        fields = {}
        for k in ['status', 'doctor_name', 'doctor_email', 'appointment_date', 'appointment_time', 'doctor_notes', 'call_room_id']:
            if k in data:
                fields[k] = data[k]

        Appointment.objects.filter(id=item_id).update(**fields)
        return JsonResponse({'status': 'updated'})

    elif request.method == 'DELETE' and item_id:
        Appointment.objects.filter(id=item_id).delete()
        return JsonResponse({'status': 'deleted'})


@csrf_exempt
def api_medications(request, item_id=None):
    if request.method == 'GET':
        patient_name = request.GET.get('patient_name')
        patient_email = request.GET.get('patient_email')

        qs = Medication.objects.all()
        if patient_email:
            qs = qs.filter(patient_email=patient_email)
        elif patient_name:
            qs = qs.filter(patient_name__icontains=patient_name)

        meds = list(qs.order_by('-created_at').values())
        return JsonResponse({'status': 'success', 'data': meds})

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        med = Medication.objects.create(
            patient_name=data.get('patient_name', data.get('patientName', 'Arthur Pendelton')),
            patient_email=data.get('patient_email', ''),
            medicine_name=data.get('medicine_name', data.get('medicineName', '')),
            dosage=data.get('dosage', data.get('medicineDosage', '')),
            frequency=data.get('frequency', data.get('medicineFrequency', 'Once Daily')),
            start_date=data.get('start_date', data.get('medicineStartDate', '')),
            end_date=data.get('end_date', data.get('medicineEndDate', '')),
            doctor_name=data.get('doctor_name', data.get('doctorName', '')),
            prescribed_by_email=data.get('prescribed_by_email', ''),
            instructions=data.get('instructions', data.get('medicineInstructions', '')),
            is_active=data.get('is_active', True)
        )
        return JsonResponse({'status': 'success', 'id': med.id})

    elif request.method == 'PUT' and item_id:
        try:
            data = json.loads(request.body)
        except Exception:
            data = {}
        fields = {}
        for k in ['is_active', 'dosage', 'frequency', 'instructions', 'medicine_name', 'end_date']:
            if k in data:
                fields[k] = data[k]
        Medication.objects.filter(id=item_id).update(**fields)
        return JsonResponse({'status': 'updated'})

    elif request.method == 'DELETE' and item_id:
        Medication.objects.filter(id=item_id).delete()
        return JsonResponse({'status': 'deleted'})


@csrf_exempt
def api_routines(request, item_id=None):
    if request.method == 'GET':
        routines = list(DailyRoutine.objects.order_by('id').values())
        return JsonResponse({'status': 'success', 'data': routines})

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        routine = DailyRoutine.objects.create(
            stage=data.get('stage', 'Morning'),
            time_str=data.get('time_str', '8:00 AM'),
            activity=data.get('activity', ''),
            icon_symbol=data.get('icon_symbol', '📌'),
            is_completed=data.get('is_completed', False)
        )
        return JsonResponse({'status': 'success', 'id': routine.id})

    elif request.method == 'PUT' and item_id:
        data = json.loads(request.body)
        DailyRoutine.objects.filter(id=item_id).update(
            is_completed=data.get('is_completed', True)
        )
        return JsonResponse({'status': 'updated'})

    elif request.method == 'DELETE' and item_id:
        DailyRoutine.objects.filter(id=item_id).delete()
        return JsonResponse({'status': 'deleted'})


@csrf_exempt
def api_tasks(request, item_id=None):
    if request.method == 'GET':
        tasks = list(Task.objects.order_by('-created_at').values())
        return JsonResponse({'status': 'success', 'data': tasks})

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        task = Task.objects.create(
            task_name=data.get('task_name', data.get('name', '')),
            category=data.get('category', 'Personal'),
            status=data.get('status', 'Pending'),
            due_date=data.get('due_date', '')
        )
        return JsonResponse({'status': 'success', 'id': task.id})

    elif request.method == 'PUT' and item_id:
        data = json.loads(request.body)
        Task.objects.filter(id=item_id).update(
            status=data.get('status', 'Completed')
        )
        return JsonResponse({'status': 'updated'})

    elif request.method == 'DELETE' and item_id:
        Task.objects.filter(id=item_id).delete()
        return JsonResponse({'status': 'deleted'})


@csrf_exempt
def api_scores(request):
    if request.method == 'GET':
        scores = list(GameScore.objects.order_by('-score')[:10].values())
        return JsonResponse({'status': 'success', 'data': scores})

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            data = request.POST

        score = GameScore.objects.create(
            game_name=data.get('game_name', 'Brain Booster'),
            player_name=data.get('player_name', 'Senior Member'),
            score=int(data.get('score', 0)),
            level=int(data.get('level', 1))
        )
        return JsonResponse({'status': 'success', 'id': score.id})
