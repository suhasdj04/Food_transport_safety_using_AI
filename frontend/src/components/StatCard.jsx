import React from 'react'

export default function StatCard({ icon: Icon, label, value, unit = '', color = 'var(--blue)', trend, sublabel }) {
  return (
    <div className="card fade-in" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: color, opacity: 0.08, filter: 'blur(20px)'
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p className="label" style={{ marginBottom: 10 }}>{label}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
            {unit && <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</span>}
          </div>
          {sublabel && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{sublabel}</p>}
          {trend !== undefined && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: trend >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>vs last hour</span>
            </div>
          )}
        </div>
        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: `${color}20`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Icon size={22} color={color} />
        </div>
      </div>
    </div>
  )
}
