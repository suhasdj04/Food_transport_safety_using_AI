from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from datetime import datetime
from database.db import db

class SensorData(db.Model):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    gas_level = Column(Float, default=0.0)
    lat = Column(Float, default=20.5937)
    lon = Column(Float, default=78.9629)
    speed = Column(Float, default=0.0)
    transport_hours = Column(Float, default=0.0)
    spoilage_risk = Column(String(20), default="SAFE")   # SAFE / WARNING / DANGEROUS
    confidence = Column(Float, default=1.0)
    timestamp = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_id": self.vehicle_id,
            "temperature": self.temperature,
            "humidity": self.humidity,
            "gas_level": self.gas_level,
            "lat": self.lat,
            "lon": self.lon,
            "speed": self.speed,
            "transport_hours": self.transport_hours,
            "spoilage_risk": self.spoilage_risk,
            "confidence": round(self.confidence, 3),
            "timestamp": self.timestamp.isoformat()
        }
