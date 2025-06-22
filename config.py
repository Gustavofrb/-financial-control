import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///contas.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')

    # Cookies cross-domain para produção
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = os.getenv('FLASK_ENV') == "production"
    SESSION_TYPE = "filesystem"
