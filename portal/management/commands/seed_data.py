from django.core.management.base import BaseCommand
from portal.models import UserAccount, PatientProfile, Appointment, Medication, DailyRoutine, Task, GameScore

class Command(BaseCommand):
    help = 'Seeds initial sample data for SageCare Senior Management system with Doctors & Seniors'

    def handle(self, *args, **kwargs):
        # 1. Doctors
        doc1, created = UserAccount.objects.get_or_create(
            email='sarah.mitchell@sagecare.com',
            defaults={
                'name': 'Dr. Sarah Mitchell',
                'role': 'doctor',
                'phone': '+1 (555) 345-6789',
                'specialty': 'Chief Cardiologist',
                'hospital': 'SageCare Heart & Vascular Institute',
                'license_no': 'MD-CARDIO-8891'
            }
        )
        if created:
            doc1.set_password('doctor123')
            doc1.save()
            self.stdout.write(self.style.SUCCESS('Created Doctor: Dr. Sarah Mitchell'))

        doc2, created = UserAccount.objects.get_or_create(
            email='robert.vance@sagecare.com',
            defaults={
                'name': 'Dr. Robert Vance',
                'role': 'doctor',
                'phone': '+1 (555) 456-7890',
                'specialty': 'Senior Orthopedist & Joint Care',
                'hospital': 'SageCare Mobility & Wellness Clinic',
                'license_no': 'MD-ORTHO-4412'
            }
        )
        if created:
            doc2.set_password('doctor123')
            doc2.save()
            self.stdout.write(self.style.SUCCESS('Created Doctor: Dr. Robert Vance'))

        # 2. Seniors
        senior1, created = UserAccount.objects.get_or_create(
            email='arthur@sagecare.com',
            defaults={
                'name': 'Arthur Pendelton',
                'role': 'senior',
                'phone': '+1 (555) 123-4567',
                'age': 74,
                'address': '42 Whispering Pines Lane, Brookside Gardens, CA 90210',
                'emergency_contact': 'Eleanor Pendelton (Daughter)',
                'emergency_phone': '+1 (555) 234-5678',
                'health_conditions': 'Mild Hypertension, Osteoarthritis in knees, Early-stage Presbycusis',
                'allergies': 'Penicillin, Sulfa drugs, Raw Shellfish',
                'photo_data': 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
            }
        )
        if created:
            senior1.set_password('password123')
            senior1.save()
            self.stdout.write(self.style.SUCCESS('Created Senior: Arthur Pendelton'))

        senior2, created = UserAccount.objects.get_or_create(
            email='eleanor@sagecare.com',
            defaults={
                'name': 'Eleanor Vance',
                'role': 'senior',
                'phone': '+1 (555) 888-9999',
                'age': 71,
                'address': '19 Meadowbrook View, Sunnyvale, CA 94086',
                'emergency_contact': 'David Vance (Son)',
                'emergency_phone': '+1 (555) 777-6666',
                'health_conditions': 'Type 2 Diabetes, Mild Asthma',
                'allergies': 'Aspirin, Ibuprofen',
                'photo_data': 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&auto=format&fit=crop&q=80'
            }
        )
        if created:
            senior2.set_password('password123')
            senior2.save()
            self.stdout.write(self.style.SUCCESS('Created Senior: Eleanor Vance'))

        # Sync patient profiles
        PatientProfile.objects.update_or_create(
            user=senior1,
            defaults={
                'name': senior1.name,
                'age': senior1.age,
                'address': senior1.address,
                'emergency_contact': senior1.emergency_contact,
                'emergency_phone': senior1.emergency_phone,
                'health_conditions': senior1.health_conditions,
                'medications_summary': 'Amlodipine 5mg (Daily morning), Glucosamine (Noon), Low-Dose Aspirin (Evening)',
                'allergies': senior1.allergies,
                'photo_data': senior1.photo_data
            }
        )

        # 3. Appointments with Doctor links & Video Call Rooms
        Appointment.objects.update_or_create(
            patient_name='Arthur Pendelton',
            doctor_name='Dr. Sarah Mitchell',
            defaults={
                'patient_email': 'arthur@sagecare.com',
                'doctor_email': 'sarah.mitchell@sagecare.com',
                'consultation_type': 'Online',
                'appointment_date': '2026-10-12',
                'appointment_time': '10:30 AM',
                'reason': 'Routine blood pressure review & cardiovascular wellness checkup.',
                'status': 'Confirmed',
                'call_room_id': 'room-sc-arthur-mitchell',
                'doctor_notes': 'Patient reported mild fatigue in early mornings. BP trend appears stable around 128/82.'
            }
        )

        Appointment.objects.update_or_create(
            patient_name='Arthur Pendelton',
            doctor_name='Dr. Robert Vance',
            defaults={
                'patient_email': 'arthur@sagecare.com',
                'doctor_email': 'robert.vance@sagecare.com',
                'consultation_type': 'Online',
                'appointment_date': '2026-10-18',
                'appointment_time': '02:00 PM',
                'reason': 'Knee joint mobility follow-up and physical therapy progress check.',
                'status': 'Confirmed',
                'call_room_id': 'room-sc-arthur-vance',
                'doctor_notes': 'Knee flexibility improved by 15% after recommended daily garden strolls.'
            }
        )

        Appointment.objects.update_or_create(
            patient_name='Eleanor Vance',
            doctor_name='Dr. Sarah Mitchell',
            defaults={
                'patient_email': 'eleanor@sagecare.com',
                'doctor_email': 'sarah.mitchell@sagecare.com',
                'consultation_type': 'Online',
                'appointment_date': '2026-10-14',
                'appointment_time': '11:15 AM',
                'reason': 'Diabetic circulation review and foot numbness evaluation.',
                'status': 'Pending',
                'call_room_id': 'room-sc-eleanor-mitchell',
                'doctor_notes': 'Check fasting glucose log for the past 2 weeks.'
            }
        )
        self.stdout.write(self.style.SUCCESS('Seeded Appointments with Call Rooms.'))

        # 4. Medications
        Medication.objects.update_or_create(
            medicine_name='Amlodipine Besylate',
            patient_name='Arthur Pendelton',
            defaults={
                'patient_email': 'arthur@sagecare.com',
                'dosage': '5 mg Tablet',
                'frequency': 'Every morning after breakfast',
                'start_date': '2026-01-10',
                'end_date': '2027-01-10',
                'doctor_name': 'Dr. Sarah Mitchell',
                'prescribed_by_email': 'sarah.mitchell@sagecare.com',
                'instructions': 'Take with a full glass of warm water. Avoid grapefruit.',
                'is_active': True
            }
        )

        Medication.objects.update_or_create(
            medicine_name='Glucosamine Sulfate & Chondroitin',
            patient_name='Arthur Pendelton',
            defaults={
                'patient_email': 'arthur@sagecare.com',
                'dosage': '1000 mg Capsule',
                'frequency': 'Once daily with midday meal',
                'start_date': '2026-03-01',
                'end_date': '2026-12-31',
                'doctor_name': 'Dr. Robert Vance',
                'prescribed_by_email': 'robert.vance@sagecare.com',
                'instructions': 'Joint nourishment. Take consistently after lunch.',
                'is_active': True
            }
        )

        Medication.objects.update_or_create(
            medicine_name='Metformin HCl',
            patient_name='Eleanor Vance',
            defaults={
                'patient_email': 'eleanor@sagecare.com',
                'dosage': '500 mg Tablet',
                'frequency': 'Twice daily with meals',
                'start_date': '2026-02-15',
                'end_date': '2027-02-15',
                'doctor_name': 'Dr. Sarah Mitchell',
                'prescribed_by_email': 'sarah.mitchell@sagecare.com',
                'instructions': 'Blood sugar control. Take with breakfast and dinner.',
                'is_active': True
            }
        )
        self.stdout.write(self.style.SUCCESS('Seeded Medications with Doctor & Patient linkage.'))
