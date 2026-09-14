"""Main application factory for the NHealth Flask backend with PostgreSQL / SQLAlchemy & RBAC."""

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

    # Ensure tables exist
    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
