import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

def generate_training_data(n=5000):
    """Generate synthetic sensor training data for food spoilage prediction."""
    np.random.seed(42)
    data = []

    for _ in range(n):
        temp = np.random.uniform(-30, 50)
        humidity = np.random.uniform(20, 100)
        gas_level = np.random.uniform(50, 900)
        transport_hours = np.random.uniform(0, 72)
        speed_violation = np.random.choice([0, 1], p=[0.8, 0.2])

        # Determine spoilage risk label
        danger_score = 0

        # Temperature scoring (generic safe range 2–10°C)
        if temp < 0 or temp > 25:
            danger_score += 3
        elif temp < 2 or temp > 15:
            danger_score += 2
        elif temp > 10:
            danger_score += 1

        # Humidity scoring
        if humidity > 90:
            danger_score += 3
        elif humidity > 80:
            danger_score += 2
        elif humidity > 70:
            danger_score += 1

        # Gas leakage scoring
        if gas_level > 600:
            danger_score += 4
        elif gas_level > 400:
            danger_score += 2
        elif gas_level > 300:
            danger_score += 1

        # Transport time scoring
        if transport_hours > 48:
            danger_score += 3
        elif transport_hours > 24:
            danger_score += 2
        elif transport_hours > 12:
            danger_score += 1

        # Speed violation
        danger_score += speed_violation

        # Assign labels
        if danger_score >= 7:
            label = 2  # DANGEROUS
        elif danger_score >= 3:
            label = 1  # WARNING
        else:
            label = 0  # SAFE

        data.append([temp, humidity, gas_level, transport_hours, speed_violation, label])

    df = pd.DataFrame(data, columns=["temperature", "humidity", "gas_level", "transport_hours", "speed_violation", "label"])
    return df

def train_model():
    print("[AI] Generating training data...")
    df = generate_training_data(5000)

    X = df[["temperature", "humidity", "gas_level", "transport_hours", "speed_violation"]]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print("[AI] Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight="balanced"
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"[AI] Model Accuracy: {acc:.4f}")
    print("\n[AI] Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["SAFE", "WARNING", "DANGEROUS"]))

    # Save model
    joblib.dump(model, MODEL_PATH)
    print(f"[AI] Model saved to: {MODEL_PATH}")
    return model

if __name__ == "__main__":
    train_model()
