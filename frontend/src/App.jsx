import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import VehicleTracking from './pages/VehicleTracking'
import SensorMonitor from './pages/SensorMonitor'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppLayout({ user, onLogout, children }) {
  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">{children}</div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fs_user')) } catch { return null }
  })

  const handleLogin = (u) => setUser(u)
  const handleLogout = () => {
    localStorage.removeItem('fs_token')
    localStorage.removeItem('fs_user')
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/tracking" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}><VehicleTracking /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/sensors" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}><SensorMonitor /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/alerts" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}><Alerts /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}><Reports /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
