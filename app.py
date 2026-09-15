"""Main application factory for the NHealth Flask backend with PostgreSQL / SQLAlchemy & RBAC."""

import importlib.util
import pkgutil
if not hasattr(pkgutil, 'get_loader'):
    def _safe_get_loader(name):
        try:
            spec = importlib.util.find_spec(name)
            return spec.loader if spec else None
        except Exception:
            return None
    pkgutil.get_loader = _safe_get_loader

import os
from flask import Flask
from models import db, User
from routes.main import main_bp
from routes.api import api_bp
from config import DevelopmentConfig, ProductionConfig
from auth import get_current_user

def create_app(config_class=None):
    """Create and configure the Flask application."""
    if config_class is None:
        if os.environ.get('FLASK_ENV') == 'production':
            config_class = ProductionConfig
        else:
            config_class = DevelopmentConfig

    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config.from_object(config_class)

    # Initialize SQLAlchemy
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)

    # Context processor to make current_user available in all Jinja templates
    @app.context_processor
    def inject_user():
        return {'current_user': get_current_user()}

    # Ensure tables exist and seed demo data on fresh deployment
    with app.app_context():
        try:
            db.create_all()
            if not User.query.first():
                from seed_db import seed_database
                seed_database(existing_app=app)
        except Exception as e:
            app.logger.warning(f"Database auto-setup notification: {e}")

    return app

# Module-level application instance for Gunicorn WSGI on Render
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
