import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Truck, Activity, Bell, BarChart3, LogOut, ShieldCheck } from 'lucide-react'

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tracking',   icon: Truck,            label: 'Vehicle Tracking' },
  { to: '/sensors',    icon: Activity,         label: 'Sensor Monitor' },
  { to: '/alerts',     icon: Bell,             label: 'Alerts' },
  { to: '/reports',    icon: BarChart3,        label: 'Reports' },
]

export default function Sidebar({ user, onLogout }) {
  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      padding: '0', flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59,130,246,0.4)'
          }}>
            <ShieldCheck size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>FoodSafe</div>
            <div style={{ fontSize: 11, color: 'var(--blue-light)', fontWeight: 500 }}>AI Monitor</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 14px', borderRadius: 10,
            textDecoration: 'none', transition: 'all 0.2s',
            fontWeight: 500, fontSize: 14,
            background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
            color: isActive ? 'var(--blue-light)' : 'var(--text-secondary)',
            borderLeft: isActive ? '3px solid var(--blue)' : '3px solid transparent',
          })}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10, marginBottom: 8,
          background: 'var(--bg-card)'
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--blue), var(--purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={onLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '9px 14px' }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
