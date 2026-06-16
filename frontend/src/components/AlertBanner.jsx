import React from 'react'
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

const icons = { CRITICAL: AlertCircle, HIGH: AlertTriangle, MEDIUM: AlertTriangle, LOW: Info }
const colors = {
  CRITICAL: { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.4)',  color: '#EF4444' },
  HIGH:     { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.3)',  color: '#F87171' },
  MEDIUM:   { bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.35)',color: '#F59E0B' },
  LOW:      { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', color: '#60A5FA' },
}

export default function AlertBanner({ alert, onResolve }) {
  if (!alert) return null
  const s = colors[alert.severity] || colors.LOW
  const Icon = icons[alert.severity] || Info

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 16px', borderRadius: 10,
      background: s.bg, border: `1px solid ${s.border}`,
      marginBottom: 8, animation: 'fadeInUp 0.3s ease'
    }}>
      <Icon size={16} color={s.color} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{alert.severity}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>·</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alert.alert_type?.replace('_', ' ')}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>·</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alert.vehicle_no}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{alert.message}</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          {new Date(alert.timestamp).toLocaleTimeString()}
        </p>
      </div>
      {onResolve && (
        <button onClick={() => onResolve(alert.id)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', padding: 4, borderRadius: 6,
          transition: 'color 0.2s', flexShrink: 0
        }}>
          <X size={14} />
        </button>
      )}
    </div>
  )
}
