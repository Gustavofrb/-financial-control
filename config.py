import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///contas.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY ='6cb60152e9a082d6c92251e6d56a64b762f1343d0247a34d386c6e61ea100bd9'

    SESSION_TYPE = "filesystem"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
