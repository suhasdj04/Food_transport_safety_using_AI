import React from 'react'
import { Bell, RefreshCw } from 'lucide-react'

export default function Navbar({ title, subtitle, alertCount = 0, onRefresh }) {
  return (
    <header style={{
      height: 64, background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0
    }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="live-badge">
          <div className="live-dot" />
          LIVE
        </div>
        {onRefresh && (
          <button onClick={onRefresh} className="btn btn-ghost btn-sm">
            <RefreshCw size={14} /> Refresh
          </button>
        )}
        <div style={{ position: 'relative' }}>
          <button className="btn btn-ghost btn-sm" style={{ padding: '8px 12px' }}>
            <Bell size={16} />
            {alertCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--red)', color: 'white',
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {alertCount > 99 ? '99+' : alertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
