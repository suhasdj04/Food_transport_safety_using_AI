import React from 'react'
import { Thermometer, Droplets, Wind, Zap, MapPin } from 'lucide-react'

const riskColors = {
  SAFE:      { color: '#22C55E', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)' },
  WARNING:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  DANGEROUS: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)' },
}

const foodEmoji = { milk:'🥛', frozen:'❄️', vegetables:'🥦', meat:'🥩', fruits:'🍎', general:'📦' }

export default function VehicleCard({ vehicle, sensor, onClick }) {
  const risk = sensor?.spoilage_risk || 'SAFE'
  const rc = riskColors[risk] || riskColors.SAFE

  return (
    <div
      className="card"
      onClick={() => onClick && onClick(vehicle)}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        border: `1px solid ${rc.border}`,
        transition: 'all 0.2s',
        position: 'relative', overflow: 'hidden'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Risk glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 60, height: 60, borderRadius: '50%',
        background: rc.color, opacity: 0.07, filter: 'blur(16px)'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{foodEmoji[vehicle.food_type] || '📦'}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{vehicle.vehicle_no}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{vehicle.driver_name}</div>
          </div>
        </div>
        <span style={{
          padding: '4px 10px', borderRadius: 20,
          fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
          background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`
        }}>
          {risk}
        </span>
      </div>

      {/* Sensor readings */}
      {sensor ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <SensorVal icon={Thermometer} label="Temp" value={`${sensor.temperature}°C`} color="#60A5FA" />
          <SensorVal icon={Droplets}    label="Humidity" value={`${sensor.humidity}%`} color="#34D399" />
          <SensorVal icon={Wind}        label="Gas" value={`${sensor.gas_level} ppm`} color="#F59E0B" />
          <SensorVal icon={Zap}         label="Speed" value={`${sensor.speed} km/h`} color="#A78BFA" />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>
          Awaiting sensor data…
        </div>
      )}

      {/* GPS */}
      {sensor && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 11 }}>
          <MapPin size={11} />
          {sensor.lat?.toFixed(4)}, {sensor.lon?.toFixed(4)}
        </div>
      )}
    </div>
  )
}

function SensorVal({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 12px',
      display: 'flex', alignItems: 'center', gap: 8
    }}>
      <Icon size={14} color={color} />
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
      </div>
    </div>
  )
}
