from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database.db import db
from models.sensor_data import SensorData
from models.alert import Alert
from models.vehicle import Vehicle
from datetime import datetime, timedelta
from sqlalchemy import func

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/daily", methods=["GET"])
@jwt_required()
def daily_report():
    days = int(request.args.get("days", 7))
    result = []
    for i in range(days - 1, -1, -1):
        day = datetime.utcnow().date() - timedelta(days=i)
        start = datetime.combine(day, datetime.min.time())
        end = start + timedelta(days=1)

        readings = SensorData.query.filter(
            SensorData.timestamp >= start, SensorData.timestamp < end
        ).all()

        alerts_count = Alert.query.filter(
            Alert.timestamp >= start, Alert.timestamp < end
        ).count()

        if readings:
            avg_temp = sum(r.temperature for r in readings) / len(readings)
            avg_humidity = sum(r.humidity for r in readings) / len(readings)
            safe = sum(1 for r in readings if r.spoilage_risk == "SAFE")
            warning = sum(1 for r in readings if r.spoilage_risk == "WARNING")
            dangerous = sum(1 for r in readings if r.spoilage_risk == "DANGEROUS")
            safety_score = round(safe / len(readings) * 100, 1)
        else:
            avg_temp = avg_humidity = safety_score = 0
            safe = warning = dangerous = 0

        result.append({
            "date": day.isoformat(),
            "total_readings": len(readings),
            "avg_temperature": round(avg_temp, 2),
            "avg_humidity": round(avg_humidity, 2),
            "safety_score": safety_score,
            "alerts": alerts_count,
            "safe": safe, "warning": warning, "dangerous": dangerous
        })

    return jsonify(result), 200


@reports_bp.route("/vehicle-scores", methods=["GET"])
@jwt_required()
def vehicle_safety_scores():
    hours = int(request.args.get("hours", 24))
    since = datetime.utcnow() - timedelta(hours=hours)
    vehicles = Vehicle.query.all()
    result = []
    for v in vehicles:
        readings = SensorData.query.filter(
            SensorData.vehicle_id == v.id,
            SensorData.timestamp >= since
        ).all()
        if readings:
            safe = sum(1 for r in readings if r.spoilage_risk == "SAFE")
            score = round(safe / len(readings) * 100, 1)
            avg_temp = round(sum(r.temperature for r in readings) / len(readings), 2)
        else:
            score = 100
            avg_temp = 0

        result.append({
            "vehicle_id": v.id,
            "vehicle_no": v.vehicle_no,
            "driver_name": v.driver_name,
            "food_type": v.food_type,
            "safety_score": score,
            "avg_temperature": avg_temp,
            "total_readings": len(readings)
        })

    result.sort(key=lambda x: x["safety_score"])
    return jsonify(result), 200


@reports_bp.route("/alert-types", methods=["GET"])
@jwt_required()
def alert_type_breakdown():
    hours = int(request.args.get("hours", 24))
    since = datetime.utcnow() - timedelta(hours=hours)
    rows = db.session.query(Alert.alert_type, func.count(Alert.id))\
        .filter(Alert.timestamp >= since)\
        .group_by(Alert.alert_type).all()
    return jsonify([{"type": r[0], "count": r[1]} for r in rows]), 200
