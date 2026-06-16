import React, { useEffect, useState, useCallback } from 'react'
import { Truck, Thermometer, AlertTriangle, ShieldCheck, Activity, TrendingUp } from 'lucide-react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement,ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import VehicleCard from '../components/VehicleCard'
import AlertBanner from '../components/AlertBanner'
import { sensorsAPI, alertsAPI, vehiclesAPI } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement,ArcElement, Title, Tooltip, Legend, Filler)

const chartDefaults = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748B', font: { size: 11 } } }
  }
}

export default function Dashboard() {
  const [stats, setStats]   = useState(null)
  const [latest, setLatest] = useState([])
  const [alerts, setAlerts] = useState([])
  const [tempHistory, setTempHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    try {
      const [statsRes, latestRes, alertsRes] = await Promise.all([
        sensorsAPI.getDashStats(),
        sensorsAPI.getLatest(),
        alertsAPI.getAll({ status: 'ACTIVE', limit: 6 }),
      ])
      setStats(statsRes.data)
      setLatest(latestRes.data)
      setAlerts(alertsRes.data)

      // Build temp chart from latest readings
      const now = Date.now()
      const points = latestRes.data
        .filter(v => v.sensor)
        .map(v => ({ label: v.vehicle_no, temp: v.sensor.temperature }))
      setTempHistory(points)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 12000)
    return () => clearInterval(interval)
  }, [fetchAll])

  const resolveAlert = async (id) => {
    await alertsAPI.resolve(id)
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const tempChartData = {
    labels: tempHistory.map(p => p.label),
    datasets: [{
      label: 'Temperature (°C)',
      data: tempHistory.map(p => p.temp),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59,130,246,0.15)',
      borderWidth: 2, tension: 0.4, fill: true,
      pointBackgroundColor: '#3B82F6', pointRadius: 5
    }]
  }

  const riskData = {
    labels: ['SAFE', 'WARNING', 'DANGEROUS'],
    datasets: [{
      data: [
        latest.filter(v => v.sensor?.spoilage_risk === 'SAFE').length,
        latest.filter(v => v.sensor?.spoilage_risk === 'WARNING').length,
        latest.filter(v => v.sensor?.spoilage_risk === 'DANGEROUS').length,
      ],
      backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)'],
      borderWidth: 0
    }]
  }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Dashboard" subtitle="Food Transport Monitoring" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Dashboard" subtitle="Food Transport Monitoring"
        alertCount={stats?.active_alerts} onRefresh={fetchAll} />
      <div className="page-content">

        {/* Stat Cards */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          <StatCard icon={Truck}       label="Active Vehicles"  value={stats?.active_vehicles || 0}
            sublabel={`of ${stats?.total_vehicles || 0} total`} color="var(--blue)" />
          <StatCard icon={Thermometer} label="Avg Temperature"  value={stats?.avg_temperature?.toFixed(1) || '—'}
            unit="°C" color="#60A5FA" />
          <StatCard icon={ShieldCheck} label="Safe Rate"        value={stats?.safe_percentage || 0}
            unit="%" color="var(--green)" sublabel="last hour" />
          <StatCard icon={AlertTriangle} label="Active Alerts"  value={stats?.active_alerts || 0}
            sublabel={`${stats?.critical_alerts || 0} critical`} color="var(--red)" />
        </div>

        {/* Charts Row */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          {/* Temperature Bar */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <p className="section-title" style={{ margin: 0 }}>Temperature by Vehicle</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current readings</p>
              </div>
              <div className="live-badge"><div className="live-dot" />LIVE</div>
            </div>
            <div style={{ height: 200 }}>
              <Bar data={tempChartData} options={{
                ...chartDefaults,
                scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, title: { display: true, text: '°C', color: '#64748B', font: { size: 11 } } } }
              }} />
            </div>
          </div>

          {/* Risk Doughnut */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <p className="section-title">AI Risk Distribution</p>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
              <div style={{ width: 180, height: 180 }}>
                <Doughnut data={riskData} options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  cutout: '65%'
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['SAFE','#22C55E'], ['WARNING','#F59E0B'], ['DANGEROUS','#EF4444']].map(([label, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color, marginLeft: 'auto' }}>
                      {latest.filter(v => v.sensor?.spoilage_risk === label).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Cards + Alerts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          {/* Vehicle grid */}
          <div>
            <p className="section-title">Fleet Status</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {latest.map(v => (
                <VehicleCard key={v.id} vehicle={v} sensor={v.sensor} />
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p className="section-title" style={{ margin: 0 }}>Recent Alerts</p>
              <span className="badge badge-danger">{alerts.length}</span>
            </div>
            <div style={{ maxHeight: 500, overflowY: 'auto', paddingRight: 4 }}>
              {alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 14 }}>
                  <ShieldCheck size={32} style={{ margin: '0 auto 12px', display: 'block', color: 'var(--green)' }} />
                  All systems nominal
                </div>
              ) : (
                alerts.map(a => <AlertBanner key={a.id} alert={a} onResolve={resolveAlert} />)
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
