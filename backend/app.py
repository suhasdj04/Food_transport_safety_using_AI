import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database.db import db
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["SQLALCHEMY_DATABASE_URI"] = Config.SQLALCHEMY_DATABASE_URI
    app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY
    app.config["SECRET_KEY"] = Config.SECRET_KEY

    # Extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    JWTManager(app)

    # Register blueprints
    from routes.auth import auth_bp
    from routes.vehicles import vehicles_bp
    from routes.sensors import sensors_bp
    from routes.alerts import alerts_bp
    from routes.reports import reports_bp

    app.register_blueprint(auth_bp,     url_prefix="/api/auth")
    app.register_blueprint(vehicles_bp, url_prefix="/api/vehicles")
    app.register_blueprint(sensors_bp,  url_prefix="/api/sensors")
    app.register_blueprint(alerts_bp,   url_prefix="/api/alerts")
    app.register_blueprint(reports_bp,  url_prefix="/api/reports")

    @app.route("/")
    def index():
        return {"message": "🚚 Food Transport Safety API", "status": "running", "version": "1.0.0"}

    @app.route("/api/health")
    def health():
        return {"status": "healthy"}, 200

    return app


if __name__ == "__main__":
    app = create_app()

    # Initialize DB
    from database.init_db import init_db
    init_db(app)

    # Train AI model if not exists
    model_path = os.path.join(os.path.dirname(__file__), "ai_model", "model.pkl")
    if not os.path.exists(model_path):
        print("[APP] Training AI model for the first time...")
        from ai_model.train_model import train_model
        train_model()
    else:
        print("[APP] AI model already trained.")

    # Start sensor simulator
    from simulator.sensor_simulator import start_simulator
    start_simulator(app, interval=10)

    print("\n[APP] Food Transport Safety API running at http://localhost:5000")
    print("[APP] Demo credentials:")
    print("   Admin   : admin@foodsafety.com   / Admin@123")
    print("   Manager : manager@foodsafety.com / Manager@123")
    print("   Driver  : driver@foodsafety.com  / Driver@123\n")

    app.run(debug=False, host="0.0.0.0", port=5000, use_reloader=False)
