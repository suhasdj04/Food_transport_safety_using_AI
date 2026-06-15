import threading
import time
import random
import math
from datetime import datetime

# Vehicle route waypoints (Indian cities lat/lon)
ROUTES = {
    1: [(28.6139, 77.2090), (28.5355, 77.3910), (28.4595, 77.5021)],  # Delhi route
    2: [(19.0760, 72.8777), (18.9220, 72.8347), (18.5204, 73.8567)],  # Mumbai route
    3: [(13.0827, 80.2707), (12.9716, 77.5946), (12.8406, 77.6600)],  # Chennai route
    4: [(22.5726, 88.3639), (22.4707, 88.3741), (22.3590, 88.4733)],  # Kolkata route
    5: [(17.3850, 78.4867), (17.4399, 78.4983), (17.4065, 78.4772)],  # Hyderabad route
}

# Food type baseline temperatures
FOOD_BASELINES = {
    "milk":       {"temp": 3.0,  "temp_std": 1.0,  "humidity": 65, "gas": 100},
    "frozen":     {"temp": -20.0,"temp_std": 2.0,  "humidity": 75, "gas": 80},
    "vegetables": {"temp": 7.0,  "temp_std": 1.5,  "humidity": 80, "gas": 150},
    "meat":       {"temp": 2.0,  "temp_std": 1.0,  "humidity": 70, "gas": 200},
    "fruits":     {"temp": 10.0, "temp_std": 2.0,  "humidity": 75, "gas": 120},
    "general":    {"temp": 15.0, "temp_std": 3.0,  "humidity": 60, "gas": 150},
}

_simulator_thread = None
_running = False

def simulate_reading(vehicle_id, food_type, route_idx, tick, app):
    """Generate a realistic sensor reading for a vehicle."""
    baseline = FOOD_BASELINES.get(food_type, FOOD_BASELINES["general"])
    
    # Occasional fault events (10% chance)
    fault = random.random() < 0.10
    
    temp = baseline["temp"] + random.gauss(0, baseline["temp_std"])
    humidity = baseline["humidity"] + random.gauss(0, 5)
    gas = baseline["gas"] + abs(random.gauss(0, 30))
    speed = random.uniform(30, 85)

    if fault:
        fault_type = random.choice(["temp", "humidity", "gas", "speed"])
        if fault_type == "temp":
            temp += random.choice([-1, 1]) * random.uniform(8, 20)
        elif fault_type == "humidity":
            humidity = random.uniform(88, 98)
        elif fault_type == "gas":
            gas = random.uniform(450, 900)
        elif fault_type == "speed":
            speed = random.uniform(90, 140)

    # GPS movement along route
    waypoints = ROUTES.get(vehicle_id, ROUTES[1])
    wp_idx = tick % len(waypoints)
    wp_next = (tick + 1) % len(waypoints)
    t = (tick % 10) / 10.0
    lat = waypoints[wp_idx][0] + t * (waypoints[wp_next][0] - waypoints[wp_idx][0])
    lon = waypoints[wp_idx][1] + t * (waypoints[wp_next][1] - waypoints[wp_idx][1])
    lat += random.gauss(0, 0.001)
    lon += random.gauss(0, 0.001)

    transport_hours = (tick * 10) / 3600.0  # seconds → hours
    speed_violation = 1 if speed > 80 else 0

    return {
        "vehicle_id": vehicle_id,
        "temperature": round(temp, 2),
        "humidity": round(min(max(humidity, 20), 100), 2),
        "gas_level": round(min(max(gas, 0), 1000), 2),
        "lat": round(lat, 6),
        "lon": round(lon, 6),
        "speed": round(speed, 2),
        "transport_hours": round(transport_hours, 3),
        "speed_violation": speed_violation,
    }


def run_simulator(app, interval=10):
    """Background thread: generate sensor data every `interval` seconds."""
    from ai_model.predict import predict_spoilage
    from database.db import db
    from models.sensor_data import SensorData
    from models.alert import Alert
    from models.vehicle import Vehicle
    from config import Config

    tick = 0
    while _running:
        with app.app_context():
            try:
                vehicles = Vehicle.query.filter_by(status="active").all()
                for vehicle in vehicles:
                    reading = simulate_reading(vehicle.id, vehicle.food_type, vehicle.id, tick, app)

                    # AI Prediction
                    pred = predict_spoilage(
                        reading["temperature"], reading["humidity"],
                        reading["gas_level"], reading["transport_hours"],
                        reading["speed_violation"]
                    )

                    # Save sensor reading
                    sd = SensorData(
                        vehicle_id=vehicle.id,
                        temperature=reading["temperature"],
                        humidity=reading["humidity"],
                        gas_level=reading["gas_level"],
                        lat=reading["lat"],
                        lon=reading["lon"],
                        speed=reading["speed"],
                        transport_hours=reading["transport_hours"],
                        spoilage_risk=pred["risk"],
                        confidence=pred["confidence"],
                        timestamp=datetime.utcnow()
                    )
                    db.session.add(sd)

                    # Update vehicle GPS
                    vehicle.current_lat = reading["lat"]
                    vehicle.current_lon = reading["lon"]

                    # Generate alerts if needed
                    thresholds = Config.FOOD_THRESHOLDS.get(vehicle.food_type, Config.FOOD_THRESHOLDS["general"])
                    alerts_to_add = []

                    if reading["temperature"] > thresholds["max_temp"]:
                        alerts_to_add.append(Alert(
                            vehicle_id=vehicle.id, vehicle_no=vehicle.vehicle_no,
                            alert_type="TEMPERATURE", severity="HIGH",
                            message=f"Temperature {reading['temperature']}°C exceeds safe limit ({thresholds['max_temp']}°C) for {vehicle.food_type}"
                        ))
                    if reading["humidity"] > thresholds["max_humidity"]:
                        alerts_to_add.append(Alert(
                            vehicle_id=vehicle.id, vehicle_no=vehicle.vehicle_no,
                            alert_type="HUMIDITY", severity="MEDIUM",
                            message=f"Humidity {reading['humidity']}% exceeds limit ({thresholds['max_humidity']}%) for {vehicle.food_type}"
                        ))
                    if reading["gas_level"] > Config.GAS_DANGER_LIMIT:
                        alerts_to_add.append(Alert(
                            vehicle_id=vehicle.id, vehicle_no=vehicle.vehicle_no,
                            alert_type="GAS_LEAK", severity="CRITICAL",
                            message=f"Gas level {reading['gas_level']} ppm CRITICAL — possible gas leak!"
                        ))
                    if reading["speed"] > Config.SPEED_LIMIT:
                        alerts_to_add.append(Alert(
                            vehicle_id=vehicle.id, vehicle_no=vehicle.vehicle_no,
                            alert_type="OVERSPEEDING", severity="MEDIUM",
                            message=f"Vehicle overspeeding: {reading['speed']:.1f} km/h (limit: {Config.SPEED_LIMIT} km/h)"
                        ))
                    if pred["risk"] == "DANGEROUS":
                        alerts_to_add.append(Alert(
                            vehicle_id=vehicle.id, vehicle_no=vehicle.vehicle_no,
                            alert_type="SPOILAGE_RISK", severity="CRITICAL",
                            message=f"AI Prediction: DANGEROUS spoilage risk ({pred['confidence']*100:.1f}% confidence)"
                        ))
                    elif pred["risk"] == "WARNING":
                        alerts_to_add.append(Alert(
                            vehicle_id=vehicle.id, vehicle_no=vehicle.vehicle_no,
                            alert_type="SPOILAGE_RISK", severity="MEDIUM",
                            message=f"AI Prediction: WARNING — monitor food conditions closely"
                        ))

                    for a in alerts_to_add:
                        db.session.add(a)

                db.session.commit()
                print(f"[Simulator] Tick {tick}: updated {len(vehicles)} vehicles")

            except Exception as e:
                db.session.rollback()
                print(f"[Simulator] Error at tick {tick}: {e}")

        tick += 1
        time.sleep(interval)


def start_simulator(app, interval=10):
    global _simulator_thread, _running
    _running = True
    _simulator_thread = threading.Thread(target=run_simulator, args=(app, interval), daemon=True)
    _simulator_thread.start()
    print(f"[Simulator] Started (interval={interval}s)")


def stop_simulator():
    global _running
    _running = False
    print("[Simulator] Stopped")
