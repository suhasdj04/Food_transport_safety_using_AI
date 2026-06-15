from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database.db import db
from models.alert import Alert
from datetime import datetime, timedelta

alerts_bp = Blueprint("alerts", __name__)

@alerts_bp.route("/", methods=["GET"])
@jwt_required()
def get_alerts():
    status = request.args.get("status")       # ACTIVE / RESOLVED
    severity = request.args.get("severity")   # LOW/MEDIUM/HIGH/CRITICAL
    vehicle_id = request.args.get("vehicle_id")
    limit = int(request.args.get("limit", 100))

    q = Alert.query
    if status:
        q = q.filter_by(status=status)
    if severity:
        q = q.filter_by(severity=severity)
    if vehicle_id:
        q = q.filter_by(vehicle_id=int(vehicle_id))

    alerts = q.order_by(Alert.timestamp.desc()).limit(limit).all()
    return jsonify([a.to_dict() for a in alerts]), 200


@alerts_bp.route("/<int:alert_id>/resolve", methods=["PUT"])
@jwt_required()
def resolve_alert(alert_id):
    a = Alert.query.get_or_404(alert_id)
    a.status = "RESOLVED"
    db.session.commit()
    return jsonify({"message": "Alert resolved", "alert": a.to_dict()}), 200


@alerts_bp.route("/resolve-all", methods=["PUT"])
@jwt_required()
def resolve_all():
    Alert.query.filter_by(status="ACTIVE").update({"status": "RESOLVED"})
    db.session.commit()
    return jsonify({"message": "All alerts resolved"}), 200


@alerts_bp.route("/summary", methods=["GET"])
@jwt_required()
def alert_summary():
    active = Alert.query.filter_by(status="ACTIVE").count()
    critical = Alert.query.filter_by(status="ACTIVE", severity="CRITICAL").count()
    high = Alert.query.filter_by(status="ACTIVE", severity="HIGH").count()
    medium = Alert.query.filter_by(status="ACTIVE", severity="MEDIUM").count()
    today = datetime.utcnow().date()
    today_count = Alert.query.filter(Alert.timestamp >= datetime.combine(today, datetime.min.time())).count()
    return jsonify({
        "active": active, "critical": critical,
        "high": high, "medium": medium, "today": today_count
    }), 200
