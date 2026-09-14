"""Main routes for NHealth Technologies with Role-Based Access Control."""

from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from models import db, User, DoctorProfile, Appointment, Prescription, HealthRecord
from auth import login_user, logout_user, get_current_user, login_required, role_required

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Render the main public landing page."""
    return render_template('index.html')

# ==============================================================================
# AUTHENTICATION ROUTES
# ==============================================================================

@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Render and handle user login."""
    if session.get('user_id'):
        return redirect(url_for('main.dashboard'))

    if request.method == 'POST':
        identifier = request.form.get('identifier', '').strip()
        password = request.form.get('password', '')
        
        # Support login via email or phone number
        user = User.query.filter(
            (User.email == identifier) | (User.phone == identifier)
        ).first()

        if user and user.check_password(password):
            login_user(user)
            flash(f'Welcome back, {user.name}!', 'success')
            next_url = request.args.get('next')
            if next_url:
                return redirect(next_url)
            return redirect(url_for('main.dashboard'))
        else:
            flash('Invalid email/mobile number or password. Please try again.', 'danger')

    return render_template('auth/login.html')


@main_bp.route('/register', methods=['GET', 'POST'])
def register():
    """Render and handle user registration."""
    if session.get('user_id'):
        return redirect(url_for('main.dashboard'))

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        password = request.form.get('password', '')
        role = request.form.get('role', 'patient').strip().lower()

        # Sanitize role: only allow 'patient' or 'doctor' from public signup
        if role not in ['patient', 'doctor']:
            role = 'patient'

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('An account with this email already exists. Please log in.', 'warning')
            return redirect(url_for('main.login'))

        new_user = User(
            name=name,
            email=email,
            phone=phone,
            role=role
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.flush()

        if role == 'doctor':
            specialty = request.form.get('specialty', 'General Physician')
            license_no = request.form.get('license_no', 'Pending MCI Verification')
            doc_profile = DoctorProfile(
                user_id=new_user.id,
                specialty=specialty,
                mci_license=license_no
            )
            db.session.add(doc_profile)

        db.session.commit()
        login_user(new_user)
        flash('Account created successfully! Welcome to NHealth.', 'success')
        return redirect(url_for('main.dashboard'))

    return render_template('auth/register.html')


@main_bp.route('/logout')
def logout():
    """Log out current user and clear session."""
    logout_user()
    flash('You have been logged out safely.', 'info')
    return redirect(url_for('main.index'))


# ==============================================================================
# ROLE-BASED ACCESS CONTROL DASHBOARDS
# ==============================================================================

@main_bp.route('/dashboard')
@login_required
def dashboard():
    """Intelligent router directing users to their role-specific dashboard."""
    role = session.get('user_role')
    if role == 'admin':
        return redirect(url_for('main.admin_dashboard'))
    elif role == 'doctor':
        return redirect(url_for('main.doctor_dashboard'))
    else:
        return redirect(url_for('main.patient_dashboard'))


@main_bp.route('/dashboard/patient')
@login_required
@role_required('patient', 'admin')
def patient_dashboard():
    """Patient Dashboard matching Image 2 (12-services grid) & Image 3 (Mobile UI)."""
    user = get_current_user()
    appointments = Appointment.query.filter_by(patient_id=user.id).order_by(Appointment.created_at.desc()).all()
    prescriptions = Prescription.query.filter_by(patient_id=user.id).order_by(Prescription.created_at.desc()).all()
    records = HealthRecord.query.filter_by(patient_id=user.id).order_by(HealthRecord.created_at.desc()).all()
    doctors = User.query.filter_by(role='doctor').all()

    return render_template(
        'dashboard/patient.html',
        user=user,
        appointments=appointments,
        prescriptions=prescriptions,
        records=records,
        doctors=doctors
    )


@main_bp.route('/dashboard/doctor')
@login_required
@role_required('doctor', 'admin')
def doctor_dashboard():
    """Doctor Clinical Console with queue, vitals telemetry, and digital e-Rx."""
    user = get_current_user()
    # Fetch doctor's assigned appointments
    appointments = Appointment.query.filter(
        (Appointment.doctor_id == user.id) | (Appointment.status == 'scheduled')
    ).order_by(Appointment.created_at.desc()).all()
    
    # Recent prescriptions issued
    prescriptions = Prescription.query.filter_by(doctor_id=user.id).order_by(Prescription.created_at.desc()).all()

    return render_template(
        'dashboard/doctor.html',
        user=user,
        appointments=appointments,
        prescriptions=prescriptions
    )


@main_bp.route('/dashboard/admin')
@login_required
@role_required('admin')
def admin_dashboard():
    """Executive Administration Command Center with KPIs and system controls."""
    user = get_current_user()
    total_users = User.query.count()
    total_patients = User.query.filter_by(role='patient').count()
    total_doctors = User.query.filter_by(role='doctor').count()
    total_appointments = Appointment.query.count()
    all_users = User.query.order_by(User.created_at.desc()).limit(20).all()
    recent_appointments = Appointment.query.order_by(Appointment.created_at.desc()).limit(15).all()

    return render_template(
        'dashboard/admin.html',
        user=user,
        total_users=total_users,
        total_patients=total_patients,
        total_doctors=total_doctors,
        total_appointments=total_appointments,
        all_users=all_users,
        recent_appointments=recent_appointments
    )
