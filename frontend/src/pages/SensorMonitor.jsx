import React, { useEffect, useState, useCallback } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Thermometer, Droplets, Wind, Zap, Brain } from 'lucide-react'
import Navbar from '../components/Navbar'
import { sensorsAPI, vehiclesAPI } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const lineOpts = (label, color) => ({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B', font: { size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B', font: { size: 10 } } }
  }
})

const makeDataset = (label, data, color) => ({
  label, data,
  borderColor: color,
  backgroundColor: `${color}20`,
  borderWidth: 2, tension: 0.4, fill: true,
  pointBackgroundColor: color, pointRadius: 3
})

const riskColors = { SAFE: '#22C55E', WARNING: '#F59E0B', DANGEROUS: '#EF4444' }
const foodEmoji  = { milk:'🥛', frozen:'❄️', vegetables:'🥦', meat:'🥩', fruits:'🍎', general:'📦' }

export default function SensorMonitor() {
  const [vehicles, setVehicles]  = useState([])
  const [selected, setSelected]  = useState(null)
  const [history, setHistory]    = useState([])
  const [latest, setLatest]      = useState(null)
  const [loading, setLoading]    = useState(false)

  const [predictForm, setPredictForm] = useState({ temperature: 15, humidity: 75, gas_level: 200, transport_hours: 8 })
  const [prediction, setPrediction]   = useState(null)
  const [predicting, setPredicting]   = useState(false)

  useEffect(() => {
    vehiclesAPI.getAll().then(res => {
      setVehicles(res.data)
      if (res.data.length) setSelected(res.data[0])
    })
  }, [])

  const fetchHistory = useCallback(async () => {
    if (!selected) return
    setLoading(true)
    try {
      const res = await sensorsAPI.getHistory(selected.id, { limit: 30, hours: 6 })
      setHistory(res.data)
      if (res.data.length) setLatest(res.data[res.data.length - 1])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [selected])

  useEffect(() => {
    fetchHistory()
    const iv = setInterval(fetchHistory, 12000)
    return () => clearInterval(iv)
  }, [fetchHistory])

  const doPrediction = async () => {
    setPredicting(true)
    try {
      const res = await sensorsAPI.predict(predictForm)
      setPrediction(res.data)
    } catch (e) { console.error(e) }
    finally { setPredicting(false) }
  }

  const labels = history.map(r => new Date(r.timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }))

  const tempData    = { labels, datasets: [makeDataset('Temp °C',     history.map(r => r.temperature), '#3B82F6')] }
  const humData     = { labels, datasets: [makeDataset('Humidity %',  history.map(r => r.humidity),    '#34D399')] }
  const gasData     = { labels, datasets: [makeDataset('Gas ppm',     history.map(r => r.gas_level),   '#F59E0B')] }
  const speedData   = { labels, datasets: [makeDataset('Speed km/h',  history.map(r => r.speed),       '#A78BFA')] }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Sensor Monitor" subtitle="Real-time sensor analytics" onRefresh={fetchHistory} />
      <div className="page-content">

        {/* Vehicle selector */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {vehicles.map(v => (
            <button key={v.id} onClick={() => setSelected(v)}
              className={`btn ${selected?.id === v.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ gap: 8 }}>
              <span style={{ fontSize: 16 }}>{foodEmoji[v.food_type]}</span>
              {v.vehicle_no}
            </button>
          ))}
        </div>

        {selected && latest && (
          <>
            {/* Live gauge row */}
            <div className="grid-4" style={{ marginBottom: 24 }}>
              {[
                { icon: Thermometer, label: 'Temperature', value: `${latest.temperature}°C`, color: '#60A5FA', max: 50, val: latest.temperature + 30 },
                { icon: Droplets,    label: 'Humidity',    value: `${latest.humidity}%`,     color: '#34D399', max: 100, val: latest.humidity },
                { icon: Wind,        label: 'Gas Level',   value: `${latest.gas_level} ppm`, color: '#F59E0B', max: 1000, val: latest.gas_level },
                { icon: Zap,         label: 'Speed',       value: `${latest.speed} km/h`,    color: '#A78BFA', max: 140,  val: latest.speed },
              ].map(({ icon: Icon, label, value, color, max, val }) => (
                <div key={label} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className="label">{label}</span>
                    <Icon size={16} color={color} />
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color, marginBottom: 12 }}>{value}</div>
                  <div className="gauge-bar">
                    <div className="gauge-fill" style={{
                      width: `${Math.min((val / max) * 100, 100)}%`, background: color
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Risk */}
            <div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <p className="label" style={{ marginBottom: 4 }}>AI Spoilage Risk</p>
                <div style={{
                  fontSize: 28, fontWeight: 800,
                  color: riskColors[latest.spoilage_risk] || '#22C55E'
                }}>
                  {latest.spoilage_risk}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p className="label" style={{ marginBottom: 8 }}>Confidence</p>
                <div className="gauge-bar" style={{ height: 10, borderRadius: 5 }}>
                  <div className="gauge-fill" style={{
                    width: `${latest.confidence * 100}%`,
                    background: riskColors[latest.spoilage_risk] || '#22C55E'
                  }} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                  {(latest.confidence * 100).toFixed(1)}% confidence
                </p>
              </div>
              <div>
                <p className="label" style={{ marginBottom: 4 }}>Transport Duration</p>
                <p style={{ fontSize: 20, fontWeight: 700 }}>{latest.transport_hours?.toFixed(1)}h</p>
              </div>
              <div>
                <p className="label" style={{ marginBottom: 4 }}>Last Update</p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  {new Date(latest.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Charts Grid */}
        {history.length > 0 && (
          <div className="grid-2" style={{ marginBottom: 24 }}>
            {[
              ['Temperature History (°C)', tempData],
              ['Humidity History (%)',     humData],
              ['Gas Level History (ppm)',  gasData],
              ['Speed History (km/h)',     speedData],
            ].map(([title, data]) => (
              <div key={title} className="card">
                <p className="section-title">{title}</p>
                <div style={{ height: 160 }}>
                  <Line data={data} options={lineOpts()} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Prediction Tool */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Brain size={20} color="var(--purple)" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>AI Spoilage Predictor</h3>
            <span className="badge badge-purple">Random Forest</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 20 }}>
            {[
              ['temperature', 'Temperature (°C)', -30, 60],
              ['humidity',    'Humidity (%)',       0, 100],
              ['gas_level',   'Gas Level (ppm)',    0, 1000],
              ['transport_hours', 'Hours in Transit', 0, 72],
            ].map(([key, label, min, max]) => (
              <div key={key} className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{label}</label>
                <input className="form-input" type="number" min={min} max={max}
                  value={predictForm[key]}
                  onChange={e => setPredictForm(p => ({ ...p, [key]: parseFloat(e.target.value) }))} />
              </div>
            ))}
          </div>
          <button onClick={doPrediction} disabled={predicting} className="btn btn-primary">
            {predicting ? 'Analyzing…' : '🤖 Predict Risk'}
          </button>

          {prediction && (
            <div style={{
              marginTop: 20, padding: '20px 24px', borderRadius: 12,
              background: `${riskColors[prediction.risk]}12`,
              border: `1px solid ${riskColors[prediction.risk]}40`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <p className="label">Prediction Result</p>
                  <p style={{ fontSize: 32, fontWeight: 800, color: riskColors[prediction.risk] }}>
                    {prediction.risk}
                  </p>
                </div>
                <div>
                  <p className="label">Confidence</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: riskColors[prediction.risk] }}>
                    {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p className="label" style={{ marginBottom: 8 }}>Probability Breakdown</p>
                  {Object.entries(prediction.probabilities || {}).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 80, fontSize: 12, color: 'var(--text-secondary)' }}>{k}</span>
                      <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${v*100}%`, height: '100%', background: riskColors[k], borderRadius: 3, transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: riskColors[k], width: 44, textAlign: 'right' }}>{(v*100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
