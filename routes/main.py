"""Main routes for rendering HTML pages."""

from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Render the home page."""
    return render_template('index.html')

@main_bp.route('/doctor')
def doctor():
    """Render the doctor portal page."""
    return render_template('portals/doctor.html')

@main_bp.route('/patient')
def patient():
    """Render the patient portal page."""
    return render_template('portals/patient.html')

@main_bp.route('/pharmacy')
def pharmacy():
    """Render the pharmacy portal page."""
    return render_template('portals/pharmacy.html')

@main_bp.route('/diagnostics')
def diagnostics():
    """Render the diagnostics portal page."""
    return render_template('portals/diagnostics.html')

@main_bp.route('/ambulance')
def ambulance():
    """Render the ambulance portal page."""
    return render_template('portals/ambulance.html')

@main_bp.route('/admin')
def admin():
    """Render the admin portal page."""
    return render_template('portals/admin.html')
