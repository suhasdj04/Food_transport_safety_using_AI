import React, { useEffect, useState, useCallback } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { TrendingUp, ShieldCheck, AlertTriangle, Award } from 'lucide-react'
import Navbar from '../components/Navbar'
import { reportsAPI } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const co = { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B', font: { size: 11 } } }
const chartOpts = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#94A3B8', font: { size: 12 } } } },
  scales: { x: co, y: co }
}

const scoreColor = s => s >= 80 ? '#22C55E' : s >= 50 ? '#F59E0B' : '#EF4444'

export default function Reports() {
  const [daily, setDaily]       = useState([])
  const [scores, setScores]     = useState([])
  const [alertTypes, setAlertTypes] = useState([])
  const [loading, setLoading]   = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [dailyRes, scoresRes, typesRes] = await Promise.all([
        reportsAPI.getDaily({ days: 7 }),
        reportsAPI.getVehicleScores(),
        reportsAPI.getAlertTypes(),
      ])
      setDaily(dailyRes.data)
      setScores(scoresRes.data)
      setAlertTypes(typesRes.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const safetyLine = {
    labels: daily.map(d => d.date),
    datasets: [{
      label: 'Safety Score (%)', data: daily.map(d => d.safety_score),
      borderColor: '#22C55E', backgroundColor: 'rgba(34,197,94,0.15)',
      borderWidth: 2, fill: true, tension: 0.4, pointBackgroundColor: '#22C55E'
    }]
  }

  const tempLine = {
    labels: daily.map(d => d.date),
    datasets: [{
      label: 'Avg Temp (°C)', data: daily.map(d => d.avg_temperature),
      borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.15)',
      borderWidth: 2, fill: true, tension: 0.4, pointBackgroundColor: '#3B82F6'
    }]
  }

  const riskBar = {
    labels: daily.map(d => d.date),
    datasets: [
      { label: 'SAFE',      data: daily.map(d => d.safe),      backgroundColor: 'rgba(34,197,94,0.8)' },
      { label: 'WARNING',   data: daily.map(d => d.warning),   backgroundColor: 'rgba(245,158,11,0.8)' },
      { label: 'DANGEROUS', data: daily.map(d => d.dangerous), backgroundColor: 'rgba(239,68,68,0.8)' },
    ]
  }

  const alertPie = {
    labels: alertTypes.map(t => t.type.replace('_', ' ')),
    datasets: [{
      data: alertTypes.map(t => t.count),
      backgroundColor: ['#3B82F6','#EF4444','#F59E0B','#A78BFA','#34D399'],
      borderWidth: 0
    }]
  }

  const avgScore = scores.length ? Math.round(scores.reduce((s, v) => s + v.safety_score, 0) / scores.length) : 0

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Reports" subtitle="Safety analytics & summaries" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Reports & Analytics" subtitle="7-day safety performance summary" onRefresh={fetchAll} />
      <div className="page-content">

        {/* KPI Cards */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { icon: ShieldCheck,   label: 'Fleet Safety Score',   value: `${avgScore}%`,  color: scoreColor(avgScore) },
            { icon: TrendingUp,    label: 'Total Readings (7d)',  value: daily.reduce((s,d)=>s+d.total_readings,0), color: 'var(--blue)' },
            { icon: AlertTriangle, label: 'Total Alerts (7d)',    value: daily.reduce((s,d)=>s+d.alerts,0), color: 'var(--red)' },
            { icon: Award,         label: 'Safest Vehicle',       value: scores[scores.length-1]?.vehicle_no || '—', color: 'var(--green)' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p className="label" style={{ marginBottom: 8 }}>{label}</p>
                  <p style={{ fontSize: 26, fontWeight: 800, color }}>{value}</p>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={color} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Line charts */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <p className="section-title">Safety Score Trend (7 Days)</p>
            <div style={{ height: 200 }}><Line data={safetyLine} options={chartOpts} /></div>
          </div>
          <div className="card">
            <p className="section-title">Average Temperature Trend</p>
            <div style={{ height: 200 }}><Line data={tempLine} options={chartOpts} /></div>
          </div>
        </div>

        {/* Risk bar + Alert pie */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <p className="section-title">Daily Risk Distribution</p>
            <div style={{ height: 220 }}>
              <Bar data={riskBar} options={{ ...chartOpts, scales: { x: { ...co, stacked: true }, y: { ...co, stacked: true } } }} />
            </div>
          </div>
          <div className="card">
            <p className="section-title">Alert Type Breakdown</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: 220 }}>
              <div style={{ width: 160, flexShrink: 0 }}>
                <Doughnut data={alertPie} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '60%' }} />
              </div>
              <div style={{ flex: 1 }}>
                {alertTypes.map((t, i) => (
                  <div key={t.type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: ['#3B82F6','#EF4444','#F59E0B','#A78BFA','#34D399'][i] }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{t.type.replace('_',' ')}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{t.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle safety score table */}
        <div className="card">
          <p className="section-title">Vehicle Safety Scores (24h)</p>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle</th><th>Driver</th><th>Food Type</th>
                  <th>Avg Temp</th><th>Readings</th><th>Safety Score</th>
                </tr>
              </thead>
              <tbody>
                {scores.map(v => (
                  <tr key={v.vehicle_id}>
                    <td style={{ fontWeight: 600 }}>{v.vehicle_no}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{v.driver_name}</td>
                    <td><span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{v.food_type}</span></td>
                    <td style={{ color: '#60A5FA' }}>{v.avg_temperature}°C</td>
                    <td style={{ color: 'var(--text-muted)' }}>{v.total_readings}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 80, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${v.safety_score}%`, height: '100%', background: scoreColor(v.safety_score), borderRadius: 3, transition: 'width 0.5s' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor(v.safety_score) }}>
                          {v.safety_score}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
