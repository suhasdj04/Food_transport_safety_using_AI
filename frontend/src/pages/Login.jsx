import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Truck } from 'lucide-react'
import { authAPI } from '../services/api'

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'admin@foodsafety.com', password: 'Admin@123' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await authAPI.login(form)
      localStorage.setItem('fs_token', res.data.token)
      localStorage.setItem('fs_user', JSON.stringify(res.data.user))
      onLogin(res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { label: 'Admin',   email: 'admin@foodsafety.com',   pw: 'Admin@123' },
    { label: 'Manager', email: 'manager@foodsafety.com', pw: 'Manager@123' },
    { label: 'Driver',  email: 'driver@foodsafety.com',  pw: 'Driver@123' },
  ]

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden'
    }}>
      {/* Background orbs */}
      {[['#3B82F6','15%','10%'], ['#6366F1','80%','60%'], ['#22C55E','5%','80%']].map(([c, x, y], i) => (
        <div key={i} style={{
          position: 'fixed', width: 400, height: 400, borderRadius: '50%',
          background: c, opacity: 0.04, filter: 'blur(80px)',
          left: x, top: y, pointerEvents: 'none'
        }} />
      ))}

      <div style={{ width: '100%', maxWidth: 440, zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            boxShadow: '0 8px 32px rgba(59,130,246,0.4)', marginBottom: 20
          }}>
            <ShieldCheck size={32} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>FoodSafe AI</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>
            Smart Food Transport Monitoring System
          </p>
        </div>

        {/* Card */}
        <div className="card-glass" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Sign In</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
            Access your monitoring dashboard
          </p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8, padding: '12px 16px', marginBottom: 20,
              fontSize: 13, color: '#EF4444'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" type="email" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  style={{ paddingLeft: 42 }} placeholder="Enter email" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ paddingLeft: 42, paddingRight: 44 }} placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button id="login-btn" type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, marginTop: 8 }}>
              {loading ? 'Signing in…' : '🔐 Sign In'}
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12 }}>
            DEMO ACCOUNTS
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {demoAccounts.map(({ label, email, pw }) => (
              <button key={label} onClick={() => setForm({ email, password: pw })}
                className="btn btn-ghost btn-sm" style={{ flexDirection: 'column', gap: 2, padding: '10px 8px' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label.toLowerCase()}@…</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 32 }}>
          {[['5', 'Vehicles'], ['3', 'Food Types'], ['AI', 'Powered']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--blue-light)' }}>{v}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
