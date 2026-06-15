import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'foodsafety.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = "food_safety_secret_2024_xK9mPqR7"
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours

    # App
    DEBUG = True
    SECRET_KEY = "flask_secret_food_2024"

    # Sensor thresholds per food type
    FOOD_THRESHOLDS = {
        "milk":        {"min_temp": 2,   "max_temp": 4,   "max_humidity": 80},
        "frozen":      {"min_temp": -25, "max_temp": -18, "max_humidity": 90},
        "vegetables":  {"min_temp": 4,   "max_temp": 10,  "max_humidity": 85},
        "meat":        {"min_temp": 0,   "max_temp": 4,   "max_humidity": 75},
        "fruits":      {"min_temp": 8,   "max_temp": 13,  "max_humidity": 80},
        "general":     {"min_temp": 5,   "max_temp": 25,  "max_humidity": 75},
    }
    GAS_SAFE_LIMIT = 300      # ppm
    GAS_DANGER_LIMIT = 600    # ppm
    SPEED_LIMIT = 80          # km/h
