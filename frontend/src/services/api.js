import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fs_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fs_token')
      localStorage.removeItem('fs_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ── Auth ──
export const authAPI = {
  login:   (data) => api.post('/auth/login', data),
  register:(data) => api.post('/auth/register', data),
  profile: ()     => api.get('/auth/profile'),
}

// ── Vehicles ──
export const vehiclesAPI = {
  getAll:  ()     => api.get('/vehicles/'),
  getOne:  (id)   => api.get(`/vehicles/${id}`),
  getStats:()     => api.get('/vehicles/stats'),
  create:  (data) => api.post('/vehicles/', data),
  update:  (id, data) => api.put(`/vehicles/${id}`, data),
  delete:  (id)   => api.delete(`/vehicles/${id}`),
}

// ── Sensors ──
export const sensorsAPI = {
  getLatest:    ()      => api.get('/sensors/latest'),
  getHistory:   (id, params) => api.get(`/sensors/${id}`, { params }),
  predict:      (data)  => api.post('/sensors/predict', data),
  getDashStats: ()      => api.get('/sensors/dashboard-stats'),
}

// ── Alerts ──
export const alertsAPI = {
  getAll:     (params) => api.get('/alerts/', { params }),
  getSummary: ()       => api.get('/alerts/summary'),
  resolve:    (id)     => api.put(`/alerts/${id}/resolve`),
  resolveAll: ()       => api.put('/alerts/resolve-all'),
}

// ── Reports ──
export const reportsAPI = {
  getDaily:      (params) => api.get('/reports/daily', { params }),
  getVehicleScores: ()    => api.get('/reports/vehicle-scores'),
  getAlertTypes: ()       => api.get('/reports/alert-types'),
}
