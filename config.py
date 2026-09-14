"""Configuration settings for the NHealth Flask application with Neon PostgreSQL support."""

import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

def get_database_uri():
    """Retrieve and format database URI, supporting Neon PostgreSQL & local fallback."""
    db_url = os.environ.get('DATABASE_URL')
    if db_url:
        # Handle Heroku/Neon legacy prefix 'postgres://' -> 'postgresql://'
        if db_url.startswith('postgres://'):
            db_url = db_url.replace('postgres://', 'postgresql://', 1)
        return db_url
    
    # Default local SQLite file database for seamless development
    return f"sqlite:///{BASE_DIR / 'nhealth.db'}"

class Config:
    """Base configuration class."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'nhealth-secure-session-key-2026')
    DEBUG = False
    STATIC_FOLDER = 'static'
    TEMPLATES_FOLDER = 'templates'
    SQLALCHEMY_DATABASE_URI = get_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
