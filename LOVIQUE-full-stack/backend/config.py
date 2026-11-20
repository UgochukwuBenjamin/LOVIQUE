import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name('.env'))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'local-development-only')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') or 'sqlite:///lovique.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
