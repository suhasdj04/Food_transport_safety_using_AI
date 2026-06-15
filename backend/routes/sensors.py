from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database.db import db
from models.sensor_data import SensorData
from models.alert import Alert
from models.vehicle import Vehicle
from ai_model.predict import predict_spoilage
from config import Config
from datetime import datetime, timedelta
from sqlalchemy import func

sensors_bp = Blueprint("sensors", __name__)

@sensors_bp.route("/latest", methods=["GET"])
@jwt_required()
def get_latest():
    """Get latest sensor reading for each active vehicle."""
    vehicles = Vehicle.query.all()
    result = []
    for v in vehicles:
        sd = SensorData.query.filter_by(vehicle_id=v.id)\
                .order_by(SensorData.timestamp.desc()).first()
        entry = v.to_dict()
        entry["sensor"] = sd.to_dict() if sd else None
        result.append(entry)
    return jsonify(result), 200


@sensors_bp.route("/<int:vehicle_id>", methods=["GET"])
@jwt_required()
def get_history(vehicle_id):
    """Get sensor history for a vehicle (last N readings)."""
    limit = int(request.args.get("limit", 50))
    hours = int(request.args.get("hours", 24))
    since = datetime.utcnow() - timedelta(hours=hours)
    readings = SensorData.query\
        .filter(SensorData.vehicle_id == vehicle_id, SensorData.timestamp >= since)\
        .order_by(SensorData.timestamp.asc())\
        .limit(limit).all()
    return jsonify([r.to_dict() for r in readings]), 200


@sensors_bp.route("/", methods=["POST"])
@jwt_required()
def ingest_reading():
    """Manually ingest a sensor reading (for testing / hardware integration)."""
    data = request.get_json()
    vehicle_id = data.get("vehicle_id")
    v = Vehicle.query.get_or_404(vehicle_id)

    pred = predict_spoilage(
        data.get("temperature", 20),
        data.get("humidity", 60),
        data.get("gas_level", 100),
        data.get("transport_hours", 1),
        data.get("speed_violation", 0)
    )

    sd = SensorData(
        vehicle_id=vehicle_id,
        temperature=data.get("temperature"),
        humidity=data.get("humidity"),
        gas_level=data.get("gas_level", 0),
        lat=data.get("lat", v.current_lat),
        lon=data.get("lon", v.current_lon),
        speed=data.get("speed", 0),
        transport_hours=data.get("transport_hours", 0),
        spoilage_risk=pred["risk"],
        confidence=pred["confidence"],
    )
    db.session.add(sd)
    db.session.commit()
    return jsonify({"sensor": sd.to_dict(), "prediction": pred}), 201


@sensors_bp.route("/predict", methods=["POST"])
def predict_only():
    """Public endpoint: just predict spoilage risk from given values."""
    data = request.get_json()
    pred = predict_spoilage(
        data.get("temperature", 20),
        data.get("humidity", 60),
        data.get("gas_level", 100),
        data.get("transport_hours", 1),
        data.get("speed_violation", 0)
    )
    return jsonify(pred), 200


@sensors_bp.route("/dashboard-stats", methods=["GET"])
@jwt_required()
def dashboard_stats():
    """Aggregate statistics for dashboard cards."""
    active_count = Vehicle.query.filter_by(status="active").count()
    total_count = Vehicle.query.count()

    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    recent = SensorData.query.filter(SensorData.timestamp >= one_hour_ago).all()

    avg_temp = sum(r.temperature for r in recent) / len(recent) if recent else 0
    safe_count = sum(1 for r in recent if r.spoilage_risk == "SAFE")
    safe_pct = round(safe_count / len(recent) * 100, 1) if recent else 0

    active_alerts = Alert.query.filter_by(status="ACTIVE").count()
    critical_alerts = Alert.query.filter_by(status="ACTIVE", severity="CRITICAL").count()

    return jsonify({
        "active_vehicles": active_count,
        "total_vehicles": total_count,
        "avg_temperature": round(avg_temp, 2),
        "safe_percentage": safe_pct,
        "active_alerts": active_alerts,
        "critical_alerts": critical_alerts,
        "total_readings_1h": len(recent)
    }), 200
