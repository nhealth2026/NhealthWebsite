"""Database initialization and seeding script for NHealth Technologies."""

import json
from datetime import datetime, timedelta
from app import create_app
from models import db, User, DoctorProfile, Appointment, Prescription, HealthRecord

def seed_database(existing_app=None):
    app = existing_app or create_app()
    with app.app_context():
        print("Creating all database tables...")
        db.create_all()

        # 1. Seed Admin User
        admin = User.query.filter_by(email='admin@nhealth.tech').first()
        if not admin:
            admin = User(
                name='Executive Command Administrator',
                email='admin@nhealth.tech',
                phone='+91 80012 34567',
                role='admin',
                avatar_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            )
            admin.set_password('Admin@123')
            db.session.add(admin)
            print("  Created Admin: admin@nhealth.tech / Admin@123")

        # 2. Seed Doctor User
        doctor = User.query.filter_by(email='doctor@nhealth.tech').first()
        if not doctor:
            doctor = User(
                name='Dr. Priya Sharma, MD',
                email='doctor@nhealth.tech',
                phone='+91 98123 45678',
                role='doctor',
                avatar_url='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
            )
            doctor.set_password('Doctor@123')
            db.session.add(doctor)
            db.session.flush()

            doc_profile = DoctorProfile(
                user_id=doctor.id,
                specialty='Chief Cardiologist & Tele-Physician',
                mci_license='MCI-2014-8892',
                experience_years=12,
                hospital='NHealth Amaravati / Vijayawada Central Hub',
                consultation_fee=499.0,
                rating=4.95,
                is_available=True
            )
            db.session.add(doc_profile)
            print("  Created Doctor: doctor@nhealth.tech / Doctor@123")

        # 3. Seed Patient User
        patient = User.query.filter_by(email='patient@nhealth.tech').first()
        if not patient:
            patient = User(
                name='Rahul Verma',
                email='patient@nhealth.tech',
                phone='+91 98765 43210',
                role='patient',
                avatar_url='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            )
            patient.set_password('Patient@123')
            db.session.add(patient)
            db.session.flush()
            print("  Created Patient: patient@nhealth.tech / Patient@123")

            # Seed Sample Appointments for Patient
            apt1 = Appointment(
                patient_id=patient.id,
                doctor_id=doctor.id,
                service_type='Online Doctor Consultation',
                scheduled_date='Today',
                time_slot='10:30 AM',
                status='scheduled',
                chief_complaint='Mild palpitations & blood pressure review follow-up',
                fee=399.0
            )
            apt2 = Appointment(
                patient_id=patient.id,
                doctor_id=doctor.id,
                service_type='Lab Tests at Home',
                scheduled_date='Tomorrow',
                time_slot='07:30 AM',
                status='scheduled',
                chief_complaint='Complete Fasting Lipid & HbA1c Panel',
                fee=799.0
            )
            db.session.add_all([apt1, apt2])

            # Seed Sample Prescription
            rx = Prescription(
                appointment_id=apt1.id,
                patient_id=patient.id,
                doctor_id=doctor.id,
                diagnosis='Mild Essential Hypertension (Stage 1)',
                medicines_json=json.dumps([
                    {'name': 'Amlodipine 5mg', 'dosage': '1 Tablet', 'timing': 'Once daily (Morning)', 'duration': '30 Days'},
                    {'name': 'Atorvastatin 10mg', 'dosage': '1 Tablet', 'timing': 'Once daily (Night)', 'duration': '30 Days'},
                    {'name': 'Shelcal 500mg', 'dosage': '1 Tablet', 'timing': 'Alternate days', 'duration': '15 Days'}
                ]),
                notes='Maintain daily salt intake < 5g. Recheck blood pressure in 2 weeks.'
            )
            db.session.add(rx)

            # Seed Sample Health Records
            rec1 = HealthRecord(
                patient_id=patient.id,
                title='NABL Certified Complete Blood Count (CBC) & Lipid Profile',
                record_type='lab_report',
                details='Total Cholesterol: 198 mg/dL | HDL: 48 mg/dL | LDL: 118 mg/dL (Normal Range)',
                file_url='#'
            )
            rec2 = HealthRecord(
                patient_id=patient.id,
                title='12-Lead Digital Resting Electrocardiogram (ECG)',
                record_type='imaging',
                details='Normal Sinus Rhythm, 74 bpm, No ST-T segment abnormalities detected.',
                file_url='#'
            )
            db.session.add_all([rec1, rec2])

        db.session.commit()
        print("Database seeded successfully with all roles and initial clinical data!")

if __name__ == '__main__':
    seed_database()
