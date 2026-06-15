<<<<<<<
# 🚚 AI-Based Food Transport Safety Monitoring System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**A complete industry-level full-stack application that monitors food transportation vehicles in real-time using AI-powered spoilage prediction, live sensor data simulation, GPS tracking, driver safety analysis, and an automated alert system.**

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [AI Model Details](#-ai-model-details)
- [API Documentation](#-api-documentation)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Demo Credentials](#-demo-credentials)
- [Simulated Vehicles](#-simulated-vehicles)
- [Food Safety Thresholds](#-food-safety-thresholds)
- [Frontend Pages](#-frontend-pages)
- [Screenshots Reference](#-screenshots-reference)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)

---

## 📖 Project Overview

The **AI-Based Food Transport Safety Monitoring System** is a final-year level full-stack project that simulates a real-world cold chain food safety management platform. It demonstrates the integration of:

- **IoT Sensor Simulation** — Temperature, Humidity, Gas Level, GPS, Speed sensors
- **Artificial Intelligence** — Random Forest model predicts food spoilage risk
- **Full-Stack Web App** — React frontend + Flask REST API backend
- **Real-Time Monitoring** — Live dashboard that updates every 10–12 seconds
- **Automated Alerting** — System fires alerts when safety thresholds are breached

> This project is suitable as a **final-year engineering project**, **portfolio project**, or **industry prototype** demonstrating AI + Full Stack + IoT integration.

---

## 🔥 Features

### 1. 🌡️ Live Temperature Monitoring
- Real-time temperature readings for each food transport vehicle
- Color-coded status based on food type thresholds (milk, frozen, meat, etc.)
- Historical temperature trend charts (last 6 hours)
- Alerts triggered when temperature exceeds safe range

### 2. 💧 Humidity Detection
- Real-time humidity monitoring per vehicle
- Percentage gauge with visual fill bar
- Threshold-based alerting
- Historical trend visualization

### 3. 💨 Gas Leakage Detection
- Gas level monitoring in PPM (parts per million)
- Safe < 300 ppm → Warning 300–600 ppm → Critical > 600 ppm
- CRITICAL alert instantly generated on dangerous gas levels

### 4. 🤖 AI Food Spoilage Prediction
- **Random Forest Classifier** (95.7% accuracy)
- Inputs: Temperature, Humidity, Gas Level, Transport Hours, Speed Violation
- Output: `SAFE` / `WARNING` / `DANGEROUS` with confidence percentage
- Probability breakdown for each risk class
- Interactive AI prediction tool on Sensor Monitor page

### 5. 🗺️ GPS Vehicle Tracking
- Real-time vehicle location on OpenStreetMap (dark tiles)
- Vehicles moving along pre-defined Indian city routes
- Color-coded markers: 🟢 SAFE | 🟡 WARNING | 🔴 DANGEROUS
- Click vehicle → popup shows all live sensor readings
- Sidebar list with vehicle selector

### 6. 🚗 Driver Safety Monitoring
- Speed monitoring (limit: 80 km/h)
- Overspeeding detection and alert generation
- Speed contributes to AI spoilage risk prediction
- Speed trend visualization

### 7. 🔔 Alert System
- Automatic alert generation for:
  - Temperature violation
  - Humidity violation
  - Gas leakage (CRITICAL)
  - Overspeeding
  - AI spoilage risk (WARNING / DANGEROUS)
- Severity levels: LOW → MEDIUM → HIGH → CRITICAL
- Alert resolution (individual or resolve-all)
- Filter by status, severity, type

### 8. 📊 Reports & Analytics
- 7-day daily safety summary
- Safety score trend chart
- Average temperature trend
- Stacked risk distribution bar chart
- Alert type breakdown doughnut chart
- Vehicle safety score table with progress bars

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite 5 | SPA user interface |
| **Routing** | React Router DOM v6 | Client-side navigation |
| **Charts** | Chart.js 4 + react-chartjs-2 | Line, Bar, Doughnut charts |
| **Maps** | Leaflet.js + React Leaflet | GPS vehicle tracking map |
| **HTTP Client** | Axios | API communication |
| **Backend** | Python Flask 3 | REST API server |
| **Auth** | Flask-JWT-Extended | JWT token authentication |
| **Database ORM** | Flask-SQLAlchemy + SQLAlchemy 2 | Database abstraction |
| **Database** | SQLite | Structured data storage |
| **AI / ML** | scikit-learn (Random Forest) | Spoilage prediction |
| **Data** | NumPy + Pandas | Data generation & processing |
| **Model Storage** | Joblib | Serialize/deserialize .pkl model |
| **Password** | bcrypt | Secure password hashing |
| **CORS** | Flask-CORS | Cross-origin requests |
| **Icons** | Lucide React | UI icons |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    http://localhost:5173                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Login   │  │Dashboard │  │ Tracking │  │   Sensor     │   │
│  │  Page    │  │ Charts   │  │   Map    │  │   Monitor    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Axios HTTP + JWT Token
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              FLASK REST API  http://localhost:5000               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  /auth   │  │/vehicles │  │ /sensors │  │   /alerts    │   │
│  │ JWT Auth │  │  CRUD    │  │  Data    │  │   /reports   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│                          │                                       │
│  ┌───────────────────────┼─────────────────────────────────┐   │
│  │           AI MODULE   │         IOT SIMULATOR            │   │
│  │   Random Forest .pkl  │   Background Thread (10s tick)   │   │
│  │   Spoilage Predictor  │   5 Vehicles × Sensor Readings   │   │
│  └───────────────────────┴─────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │ SQLAlchemy ORM
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SQLITE DATABASE (foodsafety.db)                 │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────┐    │
│  │  users   │  │ vehicles │  │ sensor_data │  │  alerts  │    │
│  └──────────┘  └──────────┘  └─────────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
d:\Food_transport_safety_using_AI\
│
├── 📄 start.bat                        ← One-click startup script (Windows)
│
├── 📂 backend/                         ← Python Flask Backend
│   ├── 📄 app.py                       ← Main Flask application entry point
│   ├── 📄 config.py                    ← Configuration (DB, JWT, thresholds)
│   ├── 📄 requirements.txt             ← Python dependencies
│   ├── 📄 foodsafety.db               ← SQLite database (auto-created on first run)
│   │
│   ├── 📂 routes/                      ← API Route Blueprints
│   │   ├── 📄 auth.py                  ← POST /api/auth/login, /register, /profile
│   │   ├── 📄 vehicles.py              ← GET/POST/PUT/DELETE /api/vehicles/
│   │   ├── 📄 sensors.py               ← GET /api/sensors/latest, /history, /predict
│   │   ├── 📄 alerts.py                ← GET /api/alerts/, PUT /resolve
│   │   └── 📄 reports.py               ← GET /api/reports/daily, /vehicle-scores
│   │
│   ├── 📂 models/                      ← SQLAlchemy Database Models
│   │   ├── 📄 user.py                  ← User model (id, name, email, role)
│   │   ├── 📄 vehicle.py               ← Vehicle model (vehicle_no, driver, food_type)
│   │   ├── 📄 sensor_data.py           ← SensorData model (temp, humidity, gas, GPS)
│   │   └── 📄 alert.py                 ← Alert model (type, severity, status)
│   │
│   ├── 📂 ai_model/                    ← AI / Machine Learning Module
│   │   ├── 📄 train_model.py           ← Generate data + Train Random Forest
│   │   ├── 📄 predict.py               ← Load model + Predict spoilage risk
│   │   └── 📄 model.pkl               ← Saved trained model (auto-generated)
│   │
│   ├── 📂 simulator/                   ← IoT Sensor Simulation
│   │   └── 📄 sensor_simulator.py      ← Background thread: simulates 5 vehicles
│   │
│   └── 📂 database/                    ← Database Utilities
│       ├── 📄 db.py                    ← SQLAlchemy db instance
│       └── 📄 init_db.py               ← Create tables + seed demo data
│
└── 📂 frontend/                        ← React + Vite Frontend
    ├── 📄 index.html                   ← HTML entry point
    ├── 📄 package.json                 ← npm dependencies
    ├── 📄 vite.config.js               ← Vite config + API proxy
    │
    └── 📂 src/
        ├── 📄 main.jsx                 ← React DOM root
        ├── 📄 App.jsx                  ← Router + Auth Guard + Layout
        ├── 📄 index.css                ← Global CSS design system (dark theme)
        │
        ├── 📂 components/              ← Reusable UI Components
        │   ├── 📄 Sidebar.jsx          ← Navigation sidebar with active state
        │   ├── 📄 Navbar.jsx           ← Top bar: title, LIVE badge, alert count
        │   ├── 📄 StatCard.jsx         ← KPI card with glow effect + trend
        │   ├── 📄 AlertBanner.jsx      ← Colored alert row with resolve button
        │   └── 📄 VehicleCard.jsx      ← Vehicle status card with sensor readings
        │
        ├── 📂 pages/                   ← Full Page Components
        │   ├── 📄 Login.jsx            ← Auth form with glassmorphism design
        │   ├── 📄 Dashboard.jsx        ← Main overview with charts + fleet
        │   ├── 📄 VehicleTracking.jsx  ← Live GPS map with Leaflet.js
        │   ├── 📄 SensorMonitor.jsx    ← Detailed sensor charts + AI predictor
        │   ├── 📄 Alerts.jsx           ← Alert management center
        │   └── 📄 Reports.jsx          ← Analytics and safety reports
        │
        └── 📂 services/
            └── 📄 api.js               ← Axios instance + all API call functions
```

---

## 🗄️ Database Schema

### `users` Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment primary key |
| name | VARCHAR(100) | Full name |
| email | VARCHAR(150) UNIQUE | Login email |
| password_hash | VARCHAR(255) | bcrypt hashed password |
| role | ENUM | `admin` / `manager` / `driver` |
| created_at | DATETIME | Account creation timestamp |

### `vehicles` Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment primary key |
| vehicle_no | VARCHAR(20) UNIQUE | e.g., `FS-MH-001` |
| driver_name | VARCHAR(100) | Driver's full name |
| food_type | VARCHAR(50) | `milk`, `frozen`, `meat`, `vegetables`, `fruits`, `general` |
| status | ENUM | `active` / `idle` / `maintenance` |
| current_lat | FLOAT | Last known GPS latitude |
| current_lon | FLOAT | Last known GPS longitude |
| created_at | DATETIME | Vehicle registration date |

### `sensor_data` Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment primary key |
| vehicle_id | INTEGER FK | References `vehicles.id` |
| temperature | FLOAT | Temperature in °C |
| humidity | FLOAT | Humidity in % (0–100) |
| gas_level | FLOAT | Gas concentration in PPM |
| lat | FLOAT | GPS latitude at reading time |
| lon | FLOAT | GPS longitude at reading time |
| speed | FLOAT | Vehicle speed in km/h |
| transport_hours | FLOAT | Hours since start of transport |
| spoilage_risk | VARCHAR(20) | AI prediction: `SAFE` / `WARNING` / `DANGEROUS` |
| confidence | FLOAT | Model confidence score (0.0–1.0) |
| timestamp | DATETIME | Reading timestamp (UTC) |

### `alerts` Table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment primary key |
| vehicle_id | INTEGER FK | References `vehicles.id` |
| vehicle_no | VARCHAR(20) | Denormalized vehicle number |
| alert_type | VARCHAR(50) | `TEMPERATURE` / `HUMIDITY` / `GAS_LEAK` / `OVERSPEEDING` / `SPOILAGE_RISK` |
| severity | ENUM | `LOW` / `MEDIUM` / `HIGH` / `CRITICAL` |
| message | TEXT | Human-readable alert description |
| status | ENUM | `ACTIVE` / `RESOLVED` |
| timestamp | DATETIME | Alert creation timestamp (UTC) |

---

## 🤖 AI Model Details

### Algorithm: Random Forest Classifier (scikit-learn)

**Training Data:**
- **5,000 synthetic samples** generated programmatically
- Features designed to reflect real-world food spoilage conditions

**Input Features:**

| Feature | Type | Range | Description |
|---------|------|-------|-------------|
| `temperature` | float | -30°C to 50°C | Container temperature |
| `humidity` | float | 20% to 100% | Relative humidity |
| `gas_level` | float | 0 to 1000 ppm | Gas concentration |
| `transport_hours` | float | 0 to 72 hours | Time since transport start |
| `speed_violation` | int | 0 or 1 | 1 if speed > 80 km/h |

**Output Labels:**

| Label | Meaning | Condition |
|-------|---------|-----------|
| `SAFE` (0) | Food is safe | All parameters within normal range |
| `WARNING` (1) | Monitor closely | One or more parameters slightly off |
| `DANGEROUS` (2) | Unsafe condition | Critical parameter breach or gas leak |

**Model Performance:**
```
Accuracy: 95.70%

              precision  recall  f1-score  support
SAFE              0.91    0.74      0.82       27
WARNING           0.96    0.92      0.94      368
DANGEROUS         0.96    0.99      0.97      605

Accuracy                            0.96     1000
Macro avg         0.94    0.88      0.91     1000
Weighted avg      0.96    0.96      0.96     1000
```

**Model Training Flow:**
```
Generate 5,000 rows of synthetic sensor data
         ↓
Apply danger scoring rules (temp/humidity/gas/time/speed)
         ↓
Assign SAFE / WARNING / DANGEROUS labels
         ↓
Train/Test split (80% / 20%, stratified)
         ↓
Train RandomForestClassifier (100 trees, max_depth=10)
         ↓
Evaluate accuracy + classification report
         ↓
Save model to ai_model/model.pkl (joblib)
```

**Re-train the model anytime:**
```bash
cd backend
python ai_model/train_model.py
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 🔐 Auth Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "role": "manager"
}
```

**Response (201):**
```json
{
  "message": "Registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 4, "name": "John Doe", "email": "john@example.com", "role": "manager" }
}
```

---

#### POST `/api/auth/login`
Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@foodsafety.com",
  "password": "Admin@123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "Admin User", "role": "admin" }
}
```

---

#### GET `/api/auth/profile` 🔒
Get current user profile (requires JWT).

---

### 🚚 Vehicle Endpoints

#### GET `/api/vehicles/` 🔒
List all vehicles.

**Response:**
```json
[
  {
    "id": 1, "vehicle_no": "FS-MH-001",
    "driver_name": "Ravi Kumar", "food_type": "milk",
    "status": "active", "current_lat": 28.6139, "current_lon": 77.2090
  }
]
```

#### GET `/api/vehicles/stats` 🔒
```json
{ "total": 5, "active": 5, "idle": 0, "maintenance": 0 }
```

#### POST `/api/vehicles/` 🔒 — Create vehicle
#### PUT `/api/vehicles/<id>` 🔒 — Update vehicle
#### DELETE `/api/vehicles/<id>` 🔒 — Delete vehicle

---

### 📊 Sensor Endpoints

#### GET `/api/sensors/latest` 🔒
Latest sensor reading for every vehicle.

**Response:**
```json
[
  {
    "id": 1, "vehicle_no": "FS-MH-001",
    "sensor": {
      "temperature": 3.2, "humidity": 66.1,
      "gas_level": 112.4, "lat": 28.615, "lon": 77.210,
      "speed": 54.3, "transport_hours": 1.2,
      "spoilage_risk": "SAFE", "confidence": 0.9312,
      "timestamp": "2026-05-22T08:15:30"
    }
  }
]
```

#### GET `/api/sensors/<vehicle_id>?limit=50&hours=24` 🔒
Historical readings for one vehicle.

#### POST `/api/sensors/predict` (Public — no JWT needed)
AI spoilage prediction only.

**Request:**
```json
{
  "temperature": 12.0,
  "humidity": 90.0,
  "gas_level": 350.0,
  "transport_hours": 8.0,
  "speed_violation": 0
}
```

**Response:**
```json
{
  "risk": "WARNING",
  "confidence": 0.8741,
  "color": "#F59E0B",
  "probabilities": {
    "SAFE": 0.0621,
    "WARNING": 0.8741,
    "DANGEROUS": 0.0638
  }
}
```

#### GET `/api/sensors/dashboard-stats` 🔒
```json
{
  "active_vehicles": 5, "total_vehicles": 5,
  "avg_temperature": 5.84, "safe_percentage": 72.3,
  "active_alerts": 14, "critical_alerts": 3,
  "total_readings_1h": 130
}
```

---

### 🔔 Alert Endpoints

#### GET `/api/alerts/?status=ACTIVE&severity=CRITICAL&limit=50` 🔒
Filter alerts by status, severity, vehicle_id.

#### PUT `/api/alerts/<id>/resolve` 🔒
Resolve a single alert.

#### PUT `/api/alerts/resolve-all` 🔒
Resolve all active alerts.

#### GET `/api/alerts/summary` 🔒
```json
{ "active": 14, "critical": 3, "high": 5, "medium": 6, "today": 28 }
```

---

### 📈 Report Endpoints

#### GET `/api/reports/daily?days=7` 🔒
7-day daily summary with risk breakdown.

#### GET `/api/reports/vehicle-scores?hours=24` 🔒
Safety score per vehicle (last N hours).

#### GET `/api/reports/alert-types?hours=24` 🔒
Alert count grouped by type.

---

## ✅ Prerequisites

Before starting, make sure the following are installed:

| Tool | Version | Check Command |
|------|---------|---------------|
| Python | 3.10 or higher | `python --version` |
| pip | Latest | `pip --version` |
| Node.js | 18 or higher | `node --version` |
| npm | 9 or higher | `npm --version` |

---

## 🚀 Installation & Setup

### Step 1 — Clone / Download the Project
```bash
# If using Git:
git clone <your-repo-url>
cd Food_transport_safety_using_AI

# Or just navigate to:
cd d:\Food_transport_safety_using_AI
```

---

### Step 2 — Backend Setup (Python / Flask)

```bash
# Navigate to backend folder
cd backend

# (Optional but recommended) Create a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# Install all Python dependencies
pip install -r requirements.txt
```

**What gets installed:**
```
flask              - Web framework
flask-cors         - Cross-origin resource sharing
flask-jwt-extended - JWT authentication
flask-sqlalchemy   - ORM for database
sqlalchemy         - Database toolkit
scikit-learn       - Machine learning (Random Forest)
numpy              - Numerical computing
pandas             - Data manipulation
joblib             - Model serialization
bcrypt             - Password hashing
python-dotenv      - Environment variables
```

---

### Step 3 — Train the AI Model

```bash
# Make sure you are in the backend/ directory
cd d:\Food_transport_safety_using_AI\backend

# Train the Random Forest model
set PYTHONIOENCODING=utf-8   # (Windows — prevents encoding errors)
python ai_model/train_model.py
```

**Expected output:**
```
[AI] Generating training data...
[AI] Training Random Forest Classifier...
[AI] Model Accuracy: 0.9570

[AI] Classification Report:
              precision    recall  f1-score   support
        SAFE       0.91      0.74      0.82       27
     WARNING       0.96      0.92      0.94      368
   DANGEROUS       0.96      0.99      0.97      605
    accuracy                           0.96     1000

[AI] Model saved to: .../backend/ai_model/model.pkl
```

> **Note:** The model is trained automatically when you first run `app.py` if `model.pkl` does not exist. You only need to run this manually if you want to retrain.

---

### Step 4 — Frontend Setup (React / Vite)

```bash
# Navigate to frontend folder
cd d:\Food_transport_safety_using_AI\frontend

# Install all npm packages
npm install
```

**What gets installed:**
```
react / react-dom        - React 18
react-router-dom         - Client-side routing
axios                    - HTTP client
chart.js                 - Charts library
react-chartjs-2          - React wrapper for Chart.js
leaflet                  - Interactive maps
react-leaflet            - React wrapper for Leaflet
lucide-react             - Icon library
date-fns                 - Date utilities
vite                     - Build tool & dev server
@vitejs/plugin-react     - Vite React plugin
```

---

## ▶️ Running the Application

### Option A — One Click (Windows)

Simply **double-click** `start.bat` in the project root:
```
d:\Food_transport_safety_using_AI\start.bat
```
This opens two terminal windows (backend + frontend) and launches the browser automatically.

---

### Option B — Manual (Two Terminals)

**Terminal 1 — Start the Backend:**
```bash
cd d:\Food_transport_safety_using_AI\backend
set PYTHONIOENCODING=utf-8
python app.py
```

You should see:
```
[DB] Database initialized and seeded.
[APP] AI model already trained.
[Simulator] Started (interval=10s)

[APP] Food Transport Safety API running at http://localhost:5000
[APP] Demo credentials:
   Admin   : admin@foodsafety.com   / Admin@123
   Manager : manager@foodsafety.com / Manager@123
   Driver  : driver@foodsafety.com  / Driver@123

 * Running on http://127.0.0.1:5000
```

**Terminal 2 — Start the Frontend:**
```bash
cd d:\Food_transport_safety_using_AI\frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 1435 ms
  ➜  Local:   http://localhost:5173/
```

**Open the app:** [http://localhost:5173](http://localhost:5173)

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| **Admin** | admin@foodsafety.com | Admin@123 | Full access |
| **Manager** | manager@foodsafety.com | Manager@123 | Fleet monitoring |
| **Driver** | driver@foodsafety.com | Driver@123 | View only |

> On the Login page, click any of the three **quick-fill buttons** (Admin / Manager / Driver) to auto-populate credentials.

---

## 🚛 Simulated Vehicles

The IoT simulator generates data for 5 vehicles every **10 seconds**:

| ID | Vehicle | Driver | Food | Route | Temp Baseline |
|----|---------|--------|------|-------|---------------|
| 1 | FS-MH-001 | Ravi Kumar | Milk 🥛 | Delhi → Noida | 2°C – 4°C |
| 2 | FS-DL-002 | Suresh Patel | Frozen ❄️ | Mumbai → Pune | -20°C – -18°C |
| 3 | FS-KA-003 | Anita Singh | Vegetables 🥦 | Chennai → Bangalore | 4°C – 10°C |
| 4 | FS-WB-004 | Mohammed Ali | Meat 🥩 | Kolkata → Howrah | 0°C – 4°C |
| 5 | FS-TG-005 | Priya Sharma | Fruits 🍎 | Hyderabad | 8°C – 13°C |

**Fault Simulation:** Each tick has a **10% chance** of triggering a fault event (temperature spike, humidity surge, gas leak, or overspeeding), which automatically creates an alert.

---

## 🌡️ Food Safety Thresholds

| Food Type | Min Temp | Max Temp | Max Humidity | Gas Limit |
|-----------|----------|----------|--------------|-----------|
| Milk | 2°C | 4°C | 80% | 300 ppm |
| Frozen | -25°C | -18°C | 90% | 300 ppm |
| Vegetables | 4°C | 10°C | 85% | 300 ppm |
| Meat | 0°C | 4°C | 75% | 300 ppm |
| Fruits | 8°C | 13°C | 80% | 300 ppm |
| General | 5°C | 25°C | 75% | 300 ppm |

> **Gas Limits:** Safe < 300 ppm | Warning 300–600 ppm | Critical > 600 ppm
> **Speed Limit:** 80 km/h (violations trigger alerts and affect AI prediction)

---

## 🖥️ Frontend Pages

### 1. Login Page (`/login`)
- Glassmorphism card design on dark background
- Animated background glowing orbs
- Email + Password input with show/hide toggle
- One-click demo account buttons (Admin / Manager / Driver)
- JWT token stored in `localStorage` on success

### 2. Dashboard (`/dashboard`)
- **4 Stat Cards:** Active Vehicles, Avg Temperature, Safe Rate %, Active Alerts
- **Bar Chart:** Current temperature per vehicle (Chart.js)
- **Doughnut Chart:** AI risk distribution (SAFE / WARNING / DANGEROUS)
- **Vehicle Fleet Grid:** All vehicle cards with live sensor readings
- **Alerts Feed:** Latest 6 active alerts with resolve button
- Auto-refreshes every **12 seconds**

### 3. Vehicle Tracking (`/tracking`)
- **Dark OpenStreetMap** (CartoDB dark tiles via Leaflet.js)
- **Colored circle markers** per vehicle (green/yellow/red = SAFE/WARNING/DANGEROUS)
- **Click marker** → popup with all live sensor values
- **Sidebar list** → click to highlight vehicle on map
- Vehicle cards show temp, humidity, gas, speed
- Refreshes every **10 seconds**

### 4. Sensor Monitor (`/sensors`)
- **Vehicle selector** buttons to switch between vehicles
- **4 Live Gauges:** Temperature, Humidity, Gas Level, Speed (fill bar)
- **AI Risk display** with confidence progress bar
- **4 Line Charts** (last 30 readings / 6 hours): Temperature, Humidity, Gas, Speed
- **AI Predictor Tool:** Enter custom values → get prediction with probability breakdown
- Refreshes every **12 seconds**

### 5. Alert Center (`/alerts`)
- **4 Summary Cards:** Active Alerts, Critical, High, Today Total
- **Status Filter:** ACTIVE / RESOLVED / ALL
- **Severity Filter:** ALL / CRITICAL / HIGH / MEDIUM / LOW
- **Type Dropdown:** TEMPERATURE / HUMIDITY / GAS_LEAK / OVERSPEEDING / SPOILAGE_RISK
- **Resolve** individual alerts or **Resolve All** at once
- Auto-refreshes every **15 seconds**

### 6. Reports (`/reports`)
- **4 KPI Cards:** Fleet Safety Score, Total Readings (7d), Total Alerts (7d), Safest Vehicle
- **Safety Score Trend:** Line chart over 7 days
- **Temperature Trend:** Average temperature line chart
- **Risk Distribution:** Stacked bar chart (SAFE/WARNING/DANGEROUS per day)
- **Alert Types:** Doughnut chart of alert type breakdown
- **Vehicle Safety Table:** Per-vehicle score with progress bar

---

## 🔧 Troubleshooting

### ❌ `UnicodeEncodeError` on Windows
**Cause:** Windows terminal uses cp1252 encoding.
**Fix:** Always run the backend with:
```bash
set PYTHONIOENCODING=utf-8
python app.py
```

### ❌ `ModuleNotFoundError: No module named 'flask'`
**Fix:** Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### ❌ `FileNotFoundError: model.pkl not found`
**Fix:** Train the model first:
```bash
cd backend
python ai_model/train_model.py
```

### ❌ Frontend shows blank page or errors
**Fix 1:** Make sure backend is running on port 5000 first.
**Fix 2:** Clear browser cache and reload.
**Fix 3:** Check browser console (F12) for specific errors.

### ❌ `npm: command not found` or `npx` blocked
**Fix:** Run npm commands via cmd instead of PowerShell:
```bash
cmd /c "npm install"
cmd /c "npm run dev"
```

### ❌ Map not loading (white tiles)
**Fix:** This needs internet access to load OpenStreetMap tiles. Ensure you are connected to the internet.

### ❌ Port 5000 already in use
**Fix:** Kill the process on port 5000:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ❌ Port 5173 already in use
**Fix:** Change port in `frontend/vite.config.js`:
```js
server: { port: 3000 }
```

---

## 📈 Future Enhancements

| Feature | Description | Priority |
|---------|-------------|----------|
| 🤖 AI Chatbot | Food safety Q&A assistant using LLM | Medium |
| 📱 Mobile App | React Native mobile monitoring app | High |
| 📧 Email Alerts | SMTP email notifications for CRITICAL alerts | High |
| 📱 SMS Alerts | Twilio SMS for critical alerts | Medium |
| 📷 Computer Vision | Camera-based damaged food detection (YOLOv8) | Medium |
| 🔗 Blockchain | Immutable transport records (Ethereum/Hyperledger) | Low |
| 🌐 Real Hardware | ESP32 + DHT11 + GPS module integration | High |
| 📊 Export PDF | Generate downloadable safety reports | Medium |
| 🔐 RBAC | Role-Based Access Control enforcement | High |
| ☁️ Cloud Deploy | Deploy to AWS / Azure / Google Cloud | Medium |
| 📉 LSTM Model | Time-series deep learning for better prediction | Medium |
| 🗄️ MySQL | Migrate from SQLite to MySQL for production | Low |

---

## 👨‍💻 Project Details

**Project Title:** AI-Based Smart Food Transport Safety Monitoring System

**Domain:** Full Stack Web Development + Artificial Intelligence + IoT Simulation

**Tech Categories:** 
- Software Engineering ✅
- Machine Learning ✅
- Web Development ✅
- Database Design ✅
- REST API Design ✅
- Real-Time Systems ✅

**What Makes This a Main Project:**
- ✅ Frontend (React + Vite)
- ✅ Backend (Flask REST API)
- ✅ Database (SQLite with ORM)
- ✅ Authentication (JWT + bcrypt)
- ✅ AI Module (Random Forest, 95.7% accuracy)
- ✅ IoT Simulation (Background thread)
- ✅ Real-time Monitoring (Auto-refresh)
- ✅ Automated Alert System
- ✅ GPS Vehicle Tracking (Leaflet Maps)
- ✅ Reports & Analytics
- ✅ Industry Use Case (Cold Chain Logistics)

---

## 📄 License

This project is developed for **educational and academic purposes**.
Feel free to use, modify, and extend it for your college/university project.

---

<div align="center">

**Built with ❤️ for Food Safety**

*AI-Based Food Transport Safety Monitoring System*

</div>
=======
# Food_transport_safety_using_AI
>>>>>>>
