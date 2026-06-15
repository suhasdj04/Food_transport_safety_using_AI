import joblib
import numpy as np
import pandas as pd
import os

FEATURE_COLS = ["temperature", "humidity", "gas_level", "transport_hours", "speed_violation"]

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

RISK_LABELS = {0: "SAFE", 1: "WARNING", 2: "DANGEROUS"}
RISK_COLORS = {"SAFE": "#22c55e", "WARNING": "#f59e0b", "DANGEROUS": "#ef4444"}

_model = None

def load_model():
    global _model
    if _model is None:
        if os.path.exists(MODEL_PATH):
            _model = joblib.load(MODEL_PATH)
        else:
            raise FileNotFoundError("Model not trained yet. Run: python ai_model/train_model.py")
    return _model

def predict_spoilage(temperature: float, humidity: float, gas_level: float,
                     transport_hours: float, speed_violation: int = 0) -> dict:
    """
    Predict food spoilage risk.
    Returns: { risk: str, confidence: float, color: str, probabilities: dict }
    """
    model = load_model()
    features = pd.DataFrame([[temperature, humidity, gas_level, transport_hours, speed_violation]],
                            columns=FEATURE_COLS)
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]

    risk = RISK_LABELS[prediction]
    confidence = float(probabilities[prediction])

    return {
        "risk": risk,
        "confidence": round(confidence, 4),
        "color": RISK_COLORS[risk],
        "probabilities": {
            "SAFE": round(float(probabilities[0]), 4),
            "WARNING": round(float(probabilities[1]), 4),
            "DANGEROUS": round(float(probabilities[2]), 4)
        }
    }

def predict_batch(records: list) -> list:
    """Predict spoilage for a list of sensor records."""
    results = []
    for r in records:
        result = predict_spoilage(
            r.get("temperature", 20),
            r.get("humidity", 60),
            r.get("gas_level", 100),
            r.get("transport_hours", 1),
            r.get("speed_violation", 0)
        )
        results.append(result)
    return results
