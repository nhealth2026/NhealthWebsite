"""API routes for handling JSON requests with Neon PostgreSQL persistence."""

import json
from flask import Blueprint, request, jsonify, session
from models import db, User, Appointment, Prescription, HealthRecord
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
    """Save healthcare service or doctor appointment to database."""
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
            # Find or create a temporary/guest user
            user = User.query.filter_by(phone=phone).first() if phone else None
            if not user and phone:
                user = User(name=patient_name, email=f"patient_{phone[-4:]}@nhealth.local", phone=phone, role='patient')
                user.set_password('Guest@123')
                db.session.add(user)
                db.session.flush()
            user_id = user.id if user else 1 # fallback to primary demo user

        # Assign default doctor
        doctor = User.query.filter_by(role='doctor').first()
        doctor_id = doctor.id if doctor else None

        appointment = Appointment(
            patient_id=user_id,
            doctor_id=doctor_id,
            service_type=service,
            scheduled_date=date,
            time_slot=time,
            status='scheduled',
            chief_complaint=notes or f"Booking for {service}",
            fee=399.0
        )
        db.session.add(appointment)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Booking confirmed for {patient_name}!',
            'appointment_id': appointment.id,
            'service': service,
            'date': date,
            'time': time
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
