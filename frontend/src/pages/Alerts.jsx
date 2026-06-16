import React, { useEffect, useState, useCallback } from 'react'
import { Bell, CheckCircle, AlertCircle, Filter, CheckCheck } from 'lucide-react'
import Navbar from '../components/Navbar'
import AlertBanner from '../components/AlertBanner'
import { alertsAPI } from '../services/api'

const SEVERITIES = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const TYPES = ['ALL', 'TEMPERATURE', 'HUMIDITY', 'GAS_LEAK', 'OVERSPEEDING', 'SPOILAGE_RISK']

export default function Alerts() {
  const [alerts, setAlerts]     = useState([])
  const [summary, setSummary]   = useState(null)
  const [severity, setSeverity] = useState('ALL')
  const [type, setType]         = useState('ALL')
  const [status, setStatus]     = useState('ACTIVE')
  const [loading, setLoading]   = useState(true)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { limit: 100 }
      if (severity !== 'ALL') params.severity = severity
      if (status !== 'ALL')   params.status = status
      const [alertsRes, summaryRes] = await Promise.all([
        alertsAPI.getAll(params),
        alertsAPI.getSummary(),
      ])
      setAlerts(alertsRes.data)
      setSummary(summaryRes.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [severity, status])

  useEffect(() => { fetchAlerts(); const iv = setInterval(fetchAlerts, 15000); return () => clearInterval(iv) }, [fetchAlerts])

  const resolveAlert = async (id) => {
    await alertsAPI.resolve(id)
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const resolveAll = async () => {
    await alertsAPI.resolveAll()
    fetchAlerts()
  }

  const filtered = type === 'ALL' ? alerts : alerts.filter(a => a.alert_type === type)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Alert Center" subtitle="Monitor and manage safety alerts" onRefresh={fetchAlerts}
        alertCount={summary?.active} />
      <div className="page-content">

        {/* Summary cards */}
        {summary && (
          <div className="grid-4" style={{ marginBottom: 24 }}>
            {[
              { label: 'Active Alerts',   value: summary.active,   color: '#EF4444' },
              { label: 'Critical',        value: summary.critical, color: '#EF4444' },
              { label: 'High',            value: summary.high,     color: '#F87171' },
              { label: 'Today Total',     value: summary.today,    color: 'var(--blue)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card" style={{ textAlign: 'center' }}>
                <p className="label" style={{ marginBottom: 8 }}>{label}</p>
                <p style={{ fontSize: 36, fontWeight: 800, color }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <p className="label" style={{ marginBottom: 6 }}>Status</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['ACTIVE', 'RESOLVED', 'ALL'].map(s => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-ghost'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label" style={{ marginBottom: 6 }}>Severity</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SEVERITIES.map(s => (
                  <button key={s} onClick={() => setSeverity(s)}
                    className={`btn btn-sm ${severity === s ? 'btn-primary' : 'btn-ghost'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label" style={{ marginBottom: 6 }}>Type</p>
              <select className="form-input" value={type} onChange={e => setType(e.target.value)}
                style={{ padding: '8px 12px', fontSize: 13 }}>
                {TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={resolveAll} className="btn btn-ghost btn-sm">
                <CheckCheck size={14} /> Resolve All
              </button>
              <span className="badge badge-info">{filtered.length} alerts</span>
            </div>
          </div>
        </div>

        {/* Alert list */}
        <div className="card">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <CheckCircle size={48} style={{ margin: '0 auto 16px', display: 'block', color: 'var(--green)' }} />
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>No alerts found</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>All systems are operating normally</p>
            </div>
          ) : (
            <div>
              {filtered.map(a => (
                <AlertBanner key={a.id} alert={a}
                  onResolve={status !== 'RESOLVED' ? resolveAlert : undefined} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
