import React, { useEffect, useState, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import { Truck, Navigation, Info } from 'lucide-react'
import Navbar from '../components/Navbar'
import { sensorsAPI } from '../services/api'

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const riskColor = { SAFE: '#22C55E', WARNING: '#F59E0B', DANGEROUS: '#EF4444' }
const foodEmoji = { milk:'🥛', frozen:'❄️', vegetables:'🥦', meat:'🥩', fruits:'🍎', general:'📦' }

export default function VehicleTracking() {
  const [vehicles, setVehicles] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await sensorsAPI.getLatest()
      setVehicles(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchVehicles()
    const iv = setInterval(fetchVehicles, 10000)
    return () => clearInterval(iv)
  }, [fetchVehicles])

  const center = [20.5937, 78.9629]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar title="Vehicle Tracking" subtitle="Live GPS monitoring" onRefresh={fetchVehicles} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar list */}
        <div style={{
          width: 300, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
          overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10
        }}>
          <p className="label" style={{ marginBottom: 4 }}>Fleet — {vehicles.length} vehicles</p>
          {vehicles.map(v => {
            const risk = v.sensor?.spoilage_risk || 'SAFE'
            const color = riskColor[risk]
            const isSelected = selected?.id === v.id
            return (
              <div key={v.id} onClick={() => setSelected(isSelected ? null : v)}
                style={{
                  padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                  background: isSelected ? 'rgba(59,130,246,0.15)' : 'var(--bg-card)',
                  border: `1px solid ${isSelected ? 'var(--blue)' : 'var(--border)'}`,
                  transition: 'all 0.2s'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 20 }}>{foodEmoji[v.food_type] || '📦'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{v.vehicle_no}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.driver_name}</div>
                  </div>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', background: color,
                    boxShadow: `0 0 8px ${color}`
                  }} />
                </div>
                {v.sensor && (
                  <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {[
                      ['🌡️', `${v.sensor.temperature}°C`],
                      ['💧', `${v.sensor.humidity}%`],
                      ['💨', `${v.sensor.gas_level} ppm`],
                      ['⚡', `${v.sensor.speed} km/h`],
                    ].map(([icon, val]) => (
                      <div key={icon} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 4, alignItems: 'center' }}>
                        <span>{icon}</span> {val}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: `${color}20`, color, border: `1px solid ${color}40`
                  }}>
                    {risk}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {vehicles.map(v => {
              const lat = v.sensor?.lat || v.current_lat
              const lon = v.sensor?.lon || v.current_lon
              const risk = v.sensor?.spoilage_risk || 'SAFE'
              const color = riskColor[risk]
              if (!lat || !lon) return null
              return (
                <CircleMarker key={v.id} center={[lat, lon]}
                  radius={selected?.id === v.id ? 18 : 12}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 2 }}
                  eventHandlers={{ click: () => setSelected(v) }}>
                  <Popup>
                    <div style={{ minWidth: 180, fontFamily: 'Inter, sans-serif' }}>
                      <strong style={{ fontSize: 15 }}>{foodEmoji[v.food_type]} {v.vehicle_no}</strong>
                      <p style={{ margin: '4px 0', fontSize: 12, color: '#666' }}>{v.driver_name}</p>
                      {v.sensor && (
                        <>
                          <hr style={{ margin: '8px 0', borderColor: '#eee' }} />
                          <div style={{ fontSize: 12 }}>
                            <div>🌡️ Temp: <b>{v.sensor.temperature}°C</b></div>
                            <div>💧 Humidity: <b>{v.sensor.humidity}%</b></div>
                            <div>💨 Gas: <b>{v.sensor.gas_level} ppm</b></div>
                            <div>⚡ Speed: <b>{v.sensor.speed} km/h</b></div>
                          </div>
                          <div style={{
                            marginTop: 8, padding: '4px 8px', borderRadius: 6,
                            background: risk === 'SAFE' ? '#dcfce7' : risk === 'WARNING' ? '#fef3c7' : '#fee2e2',
                            color: risk === 'SAFE' ? '#166534' : risk === 'WARNING' ? '#92400e' : '#991b1b',
                            fontWeight: 700, fontSize: 12
                          }}>
                            AI: {risk}
                          </div>
                        </>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>

          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: 20, right: 20, zIndex: 1000,
            background: 'rgba(6,11,24,0.9)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '12px 16px', backdropFilter: 'blur(10px)'
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>AI RISK STATUS</p>
            {Object.entries(riskColor).map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
