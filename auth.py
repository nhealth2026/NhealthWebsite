"""Authentication and Role-Based Access Control (RBAC) helpers for NHealth."""

from functools import wraps
from flask import session, redirect, url_for, flash, request
from models import User

def login_user(user):
    """Establish user session with role credentials."""
    session['user_id'] = user.id
    session['user_name'] = user.name
    session['user_email'] = user.email
    session['user_role'] = user.role
    session.permanent = True

def logout_user():
    """Clear all user session data."""
    session.pop('user_id', None)
    session.pop('user_name', None)
    session.pop('user_email', None)
    session.pop('user_role', None)

def get_current_user():
    """Fetch current logged-in user instance from database."""
    user_id = session.get('user_id')
    if user_id:
        return User.query.get(user_id)
    return None

def login_required(f):
    """Decorator to enforce authenticated session."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user_id'):
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('main.login', next=request.path))
        return f(*args, **kwargs)
    return decorated_function

def role_required(*allowed_roles):
    """Decorator to enforce Role-Based Access Control (e.g. 'doctor', 'admin', 'patient')."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not session.get('user_id'):
                flash('Please log in to continue.', 'warning')
                return redirect(url_for('main.login', next=request.path))
            
            user_role = session.get('user_role')
            if user_role not in allowed_roles:
                flash(f'Access denied. This dashboard requires {", ".join(allowed_roles)} privileges.', 'danger')
                # Redirect user to their own permitted dashboard
                if user_role == 'doctor':
                    return redirect(url_for('main.doctor_dashboard'))
                elif user_role == 'admin':
                    return redirect(url_for('main.admin_dashboard'))
                else:
                    return redirect(url_for('main.patient_dashboard'))
                    
            return f(*args, **kwargs)
        return decorated_function
    return decorator
