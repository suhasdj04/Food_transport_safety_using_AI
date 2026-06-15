from sqlalchemy import Column, Integer, String, Float, Enum, DateTime
from datetime import datetime
from database.db import db

class Vehicle(db.Model):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True)
    vehicle_no = Column(String(20), unique=True, nullable=False)
    driver_name = Column(String(100), nullable=False)
    food_type = Column(String(50), default="general")
    status = Column(Enum("active", "idle", "maintenance", name="vehicle_status"), default="idle")
    current_lat = Column(Float, default=20.5937)
    current_lon = Column(Float, default=78.9629)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_no": self.vehicle_no,
            "driver_name": self.driver_name,
            "food_type": self.food_type,
            "status": self.status,
            "current_lat": self.current_lat,
            "current_lon": self.current_lon,
            "created_at": self.created_at.isoformat()
        }
