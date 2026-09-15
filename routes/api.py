"""API routes for handling JSON requests with Neon PostgreSQL persistence."""

import json
import uuid
from flask import Blueprint, request, jsonify, session
from models import db, User, Appointment, Prescription, HealthRecord, CareJourney, LabOrder, MedicineOrder
from auth import login_user

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/auth/login', methods=['POST'])
def api_login():
    """Authenticate user and return JSON status with redirect URL."""
    try:
        data = request.get_json() or {}
        identifier = data.get('identifier', '').strip()
        password = data.get('password', '')

        user = User.query.filter(
            (User.email == identifier) | (User.phone == identifier)
        ).first()

        if user and user.check_password(password):
            login_user(user)
            redirect_url = '/dashboard'
            if user.role == 'admin':
                redirect_url = '/dashboard/admin'
            elif user.role == 'doctor':
                redirect_url = '/dashboard/doctor'
            else:
                redirect_url = '/dashboard/patient'

            return jsonify({
                'success': True,
                'message': f'Welcome back, {user.name}',
                'user': user.to_dict(),
                'redirect': redirect_url
            })
        
        return jsonify({'success': False, 'message': 'Invalid email/phone or password'}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@api_bp.route('/auth/register', methods=['POST'])
def api_register():
    """Register a new patient or doctor and return JSON status."""
    try:
        data = request.get_json() or {}
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        password = data.get('password', '')
        role = data.get('role', 'patient').strip().lower()

        if role not in ['patient', 'doctor']:
            role = 'patient'

        if not name or not email or not password:
            return jsonify({'success': False, 'message': 'Name, email, and password are required'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Email address already registered'}), 409

        new_user = User(name=name, email=email, phone=phone, role=role)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        login_user(new_user)
        redirect_url = '/dashboard/doctor' if role == 'doctor' else '/dashboard/patient'

        return jsonify({
            'success': True,
            'message': 'Account created successfully',
            'user': new_user.to_dict(),
            'redirect': redirect_url
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@api_bp.route('/booking', methods=['POST'])
def booking():
    """Save healthcare service or doctor appointment, start CareJourney and create meeting link."""
    try:
        data = request.get_json() or {}
        service = data.get('service', 'Online Doctor Consultation')
        patient_name = data.get('name', 'Guest Patient')
        phone = data.get('phone', '')
        date = data.get('date', 'Today')
        time = data.get('time', 'Immediate 15-Min Slot')
        notes = data.get('notes', '')

        # Check if user is logged in
        user_id = session.get('user_id')
        if not user_id:
            # Find or create a patient user by phone
            user = User.query.filter_by(phone=phone).first() if phone else None
            if not user and phone:
                safe_digits = ''.join(c for c in phone if c.isdigit())[-4:] or '0000'
                user = User(
                    name=patient_name,
                    email=f"patient_{safe_digits}_{uuid.uuid4().hex[:4]}@nhealth.local",
                    phone=phone,
                    role='patient'
                )
                user.set_password('Guest@123')
                db.session.add(user)
                db.session.flush()
                login_user(user)
                user_id = user.id
            elif user:
                user_id = user.id
            else:
                first_pat = User.query.filter_by(role='patient').first()
                user_id = first_pat.id if first_pat else 1

        # 1. Create or attach to CareJourney
        complaint_text = notes or f"Request for {service}"
        journey = CareJourney(
            journey_code=CareJourney.generate_code(),
            patient_id=user_id,
            status='scheduled',
            chief_complaint=complaint_text,
            triage_urgency='routine'
        )
        db.session.add(journey)
        db.session.flush()

        # 2. Select assigned doctor
        doctor = User.query.filter_by(role='doctor').first()
        doctor_id = doctor.id if doctor else None

        # 3. Create Appointment with unique meeting room link
        appointment = Appointment(
            journey_id=journey.id,
            patient_id=user_id,
            doctor_id=doctor_id,
            service_type=service,
            scheduled_date=date,
            time_slot=time,
            status='scheduled',
            chief_complaint=complaint_text,
            fee=399.0
        )
        appointment.ensure_meeting_room(request.host_url)
        db.session.add(appointment)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Consultation scheduled! Meeting room ready.',
            'appointment_id': appointment.id,
            'journey_code': journey.journey_code,
            'meeting_room_id': appointment.meeting_room_id,
            'meeting_link': appointment.meeting_link,
            'service': service,
            'date': date,
            'time': time
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@api_bp.route('/prescriptions', methods=['POST'])
def create_prescription():
    """Doctor writes digital e-prescription, saved to DB and linked to CareJourney."""
    try:
        data = request.get_json() or {}
        doctor_id = session.get('user_id')
        doctor = User.query.get(doctor_id) if doctor_id else None
        
        # Fallback to demo doctor if not logged in
        if not doctor or doctor.role not in ['doctor', 'admin']:
            demo_doc = User.query.filter_by(role='doctor').first()
            doctor_id = demo_doc.id if demo_doc else 1

        appointment_id = data.get('appointment_id')
        journey_id = data.get('journey_id')
        diagnosis = data.get('diagnosis', 'General Assessment')
        medicines = data.get('medicines', [])
        advice = data.get('advice', '')

        # Resolve patient
        patient_id = None
        if appointment_id:
            apt = Appointment.query.get(appointment_id)
            if apt:
                patient_id = apt.patient_id
                if not journey_id:
                    journey_id = apt.journey_id
                apt.status = 'completed'
        
        if not patient_id:
            first_pat = User.query.filter_by(role='patient').first()
            patient_id = first_pat.id if first_pat else 1

        # Create Prescription
        rx = Prescription(
            journey_id=journey_id,
            appointment_id=appointment_id,
            patient_id=patient_id,
            doctor_id=doctor_id,
            diagnosis=diagnosis,
            medicines_json=json.dumps(medicines),
            notes=advice,
            status='issued'
        )
        db.session.add(rx)
        db.session.flush()

        # If medicines prescribed, automatically initiate a MedicineOrder in pending approval
        if medicines:
            med_order = MedicineOrder(
                journey_id=journey_id,
                prescription_id=rx.id,
                patient_id=patient_id,
                status='pending_approval',
                total_amount=len(medicines) * 120.0
            )
            db.session.add(med_order)

        # Advance CareJourney status
        if journey_id:
            journey = CareJourney.query.get(journey_id)
            if journey:
                journey.status = 'prescription_ready'

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'E-Prescription signed and saved successfully!',
            'prescription_id': rx.id
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@api_bp.route('/lab-orders', methods=['POST'])
def create_lab_order():
    """Doctor orders laboratory / diagnostic tests linked to CareJourney."""
    try:
        data = request.get_json() or {}
        doctor_id = session.get('user_id')
        appointment_id = data.get('appointment_id')
        journey_id = data.get('journey_id')
        test_names = data.get('test_names', [])
        notes = data.get('notes', '')

        patient_id = None
        if appointment_id:
            apt = Appointment.query.get(appointment_id)
            if apt:
                patient_id = apt.patient_id
                if not journey_id:
                    journey_id = apt.journey_id
        
        if not patient_id:
            first_pat = User.query.filter_by(role='patient').first()
            patient_id = first_pat.id if first_pat else 1

        lab_order = LabOrder(
            journey_id=journey_id,
            patient_id=patient_id,
            doctor_id=doctor_id,
            test_names_json=json.dumps(test_names),
            status='ordered',
            report_notes=notes,
            fee=len(test_names) * 350.0
        )
        db.session.add(lab_order)

        if journey_id:
            journey = CareJourney.query.get(journey_id)
            if journey:
                journey.status = 'tests_ordered'

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Lab orders dispatched successfully!',
            'lab_order_id': lab_order.id
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@api_bp.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submissions."""
    try:
        data = request.get_json() or {}
        name = data.get('name', '')
        email = data.get('email', '')
        message = data.get('message', '')
        return jsonify({'success': True, 'message': 'Thank you! We will reach out within 15 minutes.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

