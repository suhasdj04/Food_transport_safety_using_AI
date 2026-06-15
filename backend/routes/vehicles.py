from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database.db import db
from models.vehicle import Vehicle

vehicles_bp = Blueprint("vehicles", __name__)

@vehicles_bp.route("/", methods=["GET"])
@jwt_required()
def get_vehicles():
    vehicles = Vehicle.query.all()
    return jsonify([v.to_dict() for v in vehicles]), 200


@vehicles_bp.route("/<int:vehicle_id>", methods=["GET"])
@jwt_required()
def get_vehicle(vehicle_id):
    v = Vehicle.query.get_or_404(vehicle_id)
    return jsonify(v.to_dict()), 200


@vehicles_bp.route("/", methods=["POST"])
@jwt_required()
def create_vehicle():
    data = request.get_json()
    v = Vehicle(
        vehicle_no=data["vehicle_no"],
        driver_name=data["driver_name"],
        food_type=data.get("food_type", "general"),
        status=data.get("status", "idle"),
        current_lat=data.get("current_lat", 20.5937),
        current_lon=data.get("current_lon", 78.9629),
    )
    db.session.add(v)
    db.session.commit()
    return jsonify(v.to_dict()), 201


@vehicles_bp.route("/<int:vehicle_id>", methods=["PUT"])
@jwt_required()
def update_vehicle(vehicle_id):
    v = Vehicle.query.get_or_404(vehicle_id)
    data = request.get_json()
    for field in ["vehicle_no", "driver_name", "food_type", "status"]:
        if field in data:
            setattr(v, field, data[field])
    db.session.commit()
    return jsonify(v.to_dict()), 200


@vehicles_bp.route("/<int:vehicle_id>", methods=["DELETE"])
@jwt_required()
def delete_vehicle(vehicle_id):
    v = Vehicle.query.get_or_404(vehicle_id)
    db.session.delete(v)
    db.session.commit()
    return jsonify({"message": "Vehicle deleted"}), 200


@vehicles_bp.route("/stats", methods=["GET"])
@jwt_required()
def vehicle_stats():
    total = Vehicle.query.count()
    active = Vehicle.query.filter_by(status="active").count()
    idle = Vehicle.query.filter_by(status="idle").count()
    maintenance = Vehicle.query.filter_by(status="maintenance").count()
    return jsonify({
        "total": total, "active": active,
        "idle": idle, "maintenance": maintenance
    }), 200
