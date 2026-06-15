from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from datetime import datetime
from database.db import db

class Alert(db.Model):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    vehicle_no = Column(String(20), default="")
    alert_type = Column(String(50), nullable=False)   # TEMPERATURE / HUMIDITY / GAS / SPEED / SPOILAGE
    severity = Column(Enum("LOW", "MEDIUM", "HIGH", "CRITICAL", name="alert_severity"), default="MEDIUM")
    message = Column(Text, nullable=False)
    status = Column(Enum("ACTIVE", "RESOLVED", name="alert_status"), default="ACTIVE")
    timestamp = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_id": self.vehicle_id,
            "vehicle_no": self.vehicle_no,
            "alert_type": self.alert_type,
            "severity": self.severity,
            "message": self.message,
            "status": self.status,
            "timestamp": self.timestamp.isoformat()
        }
