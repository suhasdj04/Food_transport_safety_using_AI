import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import db
from models.user import User
from models.vehicle import Vehicle
import bcrypt

def init_db(app):
    """Create all tables and seed initial data."""
    with app.app_context():
        db.create_all()
        _seed_users()
        _seed_vehicles()
        print("[DB] Database initialized and seeded.")

def _seed_users():
    if User.query.count() == 0:
        users = [
            User(name="Admin User",    email="admin@foodsafety.com",
                 password_hash=bcrypt.hashpw(b"Admin@123", bcrypt.gensalt()).decode(),
                 role="admin"),
            User(name="Fleet Manager", email="manager@foodsafety.com",
                 password_hash=bcrypt.hashpw(b"Manager@123", bcrypt.gensalt()).decode(),
                 role="manager"),
            User(name="Ravi Kumar",    email="driver@foodsafety.com",
                 password_hash=bcrypt.hashpw(b"Driver@123", bcrypt.gensalt()).decode(),
                 role="driver"),
        ]
        db.session.add_all(users)
        db.session.commit()
        print("[DB] Seeded users")

def _seed_vehicles():
    if Vehicle.query.count() == 0:
        vehicles = [
            Vehicle(vehicle_no="FS-MH-001", driver_name="Ravi Kumar",
                    food_type="milk",       status="active",
                    current_lat=28.6139, current_lon=77.2090),
            Vehicle(vehicle_no="FS-DL-002", driver_name="Suresh Patel",
                    food_type="frozen",     status="active",
                    current_lat=19.0760, current_lon=72.8777),
            Vehicle(vehicle_no="FS-KA-003", driver_name="Anita Singh",
                    food_type="vegetables", status="active",
                    current_lat=13.0827, current_lon=80.2707),
            Vehicle(vehicle_no="FS-WB-004", driver_name="Mohammed Ali",
                    food_type="meat",       status="active",
                    current_lat=22.5726, current_lon=88.3639),
            Vehicle(vehicle_no="FS-TG-005", driver_name="Priya Sharma",
                    food_type="fruits",     status="active",
                    current_lat=17.3850, current_lon=78.4867),
        ]
        db.session.add_all(vehicles)
        db.session.commit()
        print("[DB] Seeded vehicles")
