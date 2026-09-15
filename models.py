"""Database models for NHealth Technologies — Neon PostgreSQL & SQLAlchemy."""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """User model supporting Patient, Doctor, and Admin roles."""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(25), nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='patient', index=True) # 'patient', 'doctor', 'admin'
    avatar_url = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    doctor_profile = db.relationship('DoctorProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    appointments_as_patient = db.relationship('Appointment', foreign_keys='Appointment.patient_id', backref='patient', lazy='dynamic')
    appointments_as_doctor = db.relationship('Appointment', foreign_keys='Appointment.doctor_id', backref='doctor', lazy='dynamic')
    prescriptions_as_patient = db.relationship('Prescription', foreign_keys='Prescription.patient_id', backref='patient', lazy='dynamic')
    prescriptions_as_doctor = db.relationship('Prescription', foreign_keys='Prescription.doctor_id', backref='doctor', lazy='dynamic')
    health_records = db.relationship('HealthRecord', backref='patient', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else None
        }


class DoctorProfile(db.Model):
    """Doctor specialty, licensing, and credentials profile."""
    __tablename__ = 'doctor_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    specialty = db.Column(db.String(100), nullable=False) # e.g. 'Cardiology', 'General Medicine'
    mci_license = db.Column(db.String(50), nullable=True)
    experience_years = db.Column(db.Integer, default=5)
    hospital = db.Column(db.String(150), default='NHealth Command Center')
    consultation_fee = db.Column(db.Float, default=499.0)
    rating = db.Column(db.Float, default=4.9)
    is_available = db.Column(db.Boolean, default=True)


import uuid
import json

class CareJourney(db.Model):
    """Central orchestration model: One Complaint -> One Connected Care Journey."""
    __tablename__ = 'care_journeys'

    id = db.Column(db.Integer, primary_key=True)
    journey_code = db.Column(db.String(32), unique=True, nullable=False, index=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    status = db.Column(db.String(35), default='open', index=True)
    # Status lifecycle: 'open' -> 'scheduled' -> 'in_consultation' -> 'tests_ordered' -> 'prescription_issued' -> 'medicines_dispatched' -> 'completed'
    chief_complaint = db.Column(db.Text, nullable=False)
    triage_urgency = db.Column(db.String(25), default='routine') # 'routine', 'priority', 'emergency'
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    appointments = db.relationship('Appointment', backref='care_journey', lazy=True)
    prescriptions = db.relationship('Prescription', backref='care_journey', lazy=True)
    lab_orders = db.relationship('LabOrder', backref='care_journey', lazy=True)
    medicine_orders = db.relationship('MedicineOrder', backref='care_journey', lazy=True)

    @classmethod
    def generate_code(cls):
        return f"NH-CJ-{uuid.uuid4().hex[:6].upper()}"


class Appointment(db.Model):
    """Scheduled doctor visits, telemedicine calls, and home diagnostic bookings."""
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    journey_id = db.Column(db.Integer, db.ForeignKey('care_journeys.id'), nullable=True, index=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    service_type = db.Column(db.String(80), nullable=False, default='Online Doctor Consultation')
    scheduled_date = db.Column(db.String(30), nullable=False)
    time_slot = db.Column(db.String(30), nullable=False)
    status = db.Column(db.String(25), default='scheduled', index=True) # 'scheduled', 'in_progress', 'completed', 'cancelled'
    chief_complaint = db.Column(db.Text, nullable=True)
    fee = db.Column(db.Float, default=399.0)
    
    # Real Video Consultation Link & Room ID
    meeting_room_id = db.Column(db.String(64), nullable=True, index=True)
    meeting_link = db.Column(db.String(255), nullable=True)
    doctor_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    prescriptions = db.relationship('Prescription', backref='appointment', lazy=True)

    def ensure_meeting_room(self, host_url=''):
        """Generate a cryptographically unique room ID and meeting URL if not present."""
        if not self.meeting_room_id:
            unique_token = f"nh-consult-{uuid.uuid4().hex[:10]}"
            self.meeting_room_id = unique_token
            base = host_url.rstrip('/') if host_url else ''
            self.meeting_link = f"{base}/consultation/{unique_token}" if base else f"/consultation/{unique_token}"
        return self.meeting_room_id


class Prescription(db.Model):
    """Clinical digital prescription with dosage instructions and WhatsApp delivery."""
    __tablename__ = 'prescriptions'

    id = db.Column(db.Integer, primary_key=True)
    journey_id = db.Column(db.Integer, db.ForeignKey('care_journeys.id'), nullable=True, index=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    diagnosis = db.Column(db.String(200), nullable=False)
    medicines_json = db.Column(db.Text, nullable=False) # JSON array of {name, dosage, timing, duration}
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(25), default='issued') # 'issued', 'order_created', 'fulfilled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def medicines(self):
        try:
            return json.loads(self.medicines_json)
        except Exception:
            return []


class LabOrder(db.Model):
    """Lab and Diagnostic Test order linked to Care Journey."""
    __tablename__ = 'lab_orders'

    id = db.Column(db.Integer, primary_key=True)
    journey_id = db.Column(db.Integer, db.ForeignKey('care_journeys.id'), nullable=True, index=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    test_names_json = db.Column(db.Text, nullable=False) # JSON list of test names
    status = db.Column(db.String(35), default='ordered', index=True)
    # Status: 'ordered' -> 'sample_scheduled' -> 'collected' -> 'processing' -> 'report_ready' -> 'reviewed'
    sample_collection_date = db.Column(db.String(30), nullable=True)
    report_url = db.Column(db.String(255), nullable=True)
    report_notes = db.Column(db.Text, nullable=True)
    fee = db.Column(db.Float, default=499.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def tests(self):
        try:
            return json.loads(self.test_names_json)
        except Exception:
            return []


class MedicineOrder(db.Model):
    """Prescription-linked medicine fulfilment and delivery tracking."""
    __tablename__ = 'medicine_orders'

    id = db.Column(db.Integer, primary_key=True)
    journey_id = db.Column(db.Integer, db.ForeignKey('care_journeys.id'), nullable=True, index=True)
    prescription_id = db.Column(db.Integer, db.ForeignKey('prescriptions.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    status = db.Column(db.String(30), default='pending_approval', index=True)
    # Status: 'pending_approval' -> 'confirmed' -> 'packing' -> 'dispatched' -> 'delivered'
    delivery_address = db.Column(db.Text, nullable=True)
    total_amount = db.Column(db.Float, default=299.0)
    tracking_code = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class HealthRecord(db.Model):
    """NABL lab test results, imaging, and EHR documents."""
    __tablename__ = 'health_records'

    id = db.Column(db.Integer, primary_key=True)
    journey_id = db.Column(db.Integer, db.ForeignKey('care_journeys.id'), nullable=True, index=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    record_type = db.Column(db.String(50), nullable=False) # 'lab_report', 'prescription', 'imaging'
    details = db.Column(db.Text, nullable=True)
    file_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
