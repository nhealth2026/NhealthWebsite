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


class Appointment(db.Model):
    """Scheduled doctor visits, telemedicine calls, and home diagnostic bookings."""
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    service_type = db.Column(db.String(80), nullable=False, default='Online Doctor Consultation')
    scheduled_date = db.Column(db.String(30), nullable=False)
    time_slot = db.Column(db.String(30), nullable=False)
    status = db.Column(db.String(25), default='scheduled', index=True) # 'scheduled', 'in_progress', 'completed', 'cancelled'
    chief_complaint = db.Column(db.Text, nullable=True)
    fee = db.Column(db.Float, default=399.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    prescriptions = db.relationship('Prescription', backref='appointment', lazy=True)


class Prescription(db.Model):
    """Clinical digital prescription with dosage instructions and WhatsApp delivery."""
    __tablename__ = 'prescriptions'

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    diagnosis = db.Column(db.String(200), nullable=False)
    medicines_json = db.Column(db.Text, nullable=False) # JSON array of {name, dosage, frequency, duration}
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def medicines(self):
        import json
        try:
            return json.loads(self.medicines_json)
        except Exception:
            return []


class HealthRecord(db.Model):
    """NABL lab test results, imaging, and EHR documents."""
    __tablename__ = 'health_records'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    record_type = db.Column(db.String(50), nullable=False) # 'lab_report', 'prescription', 'imaging'
    details = db.Column(db.Text, nullable=True)
    file_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
