"""Configuration settings for the NHealth Flask application."""

import os

class Config:
    """Base configuration class."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-default')
    DEBUG = False
    STATIC_FOLDER = 'static'
    TEMPLATES_FOLDER = 'templates'

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
