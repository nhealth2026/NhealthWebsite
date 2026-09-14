"""Main application factory for the NHealth Flask backend."""

import os
from flask import Flask
from routes.main import main_bp
from routes.api import api_bp
from config import DevelopmentConfig, ProductionConfig

def create_app(config_class=None):
    """Create and configure the Flask application."""
    if config_class is None:
        if os.environ.get('FLASK_ENV') == 'production':
            config_class = ProductionConfig
        else:
            config_class = DevelopmentConfig

    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config.from_object(config_class)

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
