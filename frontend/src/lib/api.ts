import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ff_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ff_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

/* --- typed helpers --- */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface JwtResponse {
  token: string
  type: string
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<ApiResponse<JwtResponse>>('/auth/login', { username, password }),
  signup: (payload: SignupRequest) =>
    api.post<ApiResponse<null>>('/auth/signup', payload),
}

export const vehiclesApi = {
  getAll: () => api.get<Vehicle[]>('/vehicles'),
  getById: (id: number) => api.get<Vehicle>(`/vehicles/${id}`),
  create: (v: Partial<Vehicle>) => api.post<Vehicle>('/vehicles', v),
  update: (id: number, v: Partial<Vehicle>) => api.put<Vehicle>(`/vehicles/${id}`, v),
  delete: (id: number) => api.delete(`/vehicles/${id}`),
}

export const driversApi = {
  getAll: () => api.get<Driver[]>('/drivers'),
  getById: (id: number) => api.get<Driver>(`/drivers/${id}`),
  create: (d: Partial<Driver>) => api.post<Driver>('/drivers', d),
  update: (id: number, d: Partial<Driver>) => api.put<Driver>(`/drivers/${id}`, d),
  delete: (id: number) => api.delete(`/drivers/${id}`),
}

export const routesApi = {
  getAll: () => api.get<Route[]>('/routes'),
  getById: (id: number) => api.get<Route>(`/routes/${id}`),
  create: (r: Partial<Route>) => api.post<Route>('/routes', r),
  update: (id: number, r: Partial<Route>) => api.put<Route>(`/routes/${id}`, r),
  delete: (id: number) => api.delete(`/routes/${id}`),
}

export const deliveriesApi = {
  getAll: () => api.get<Delivery[]>('/deliveries'),
}

/* --- domain types --- */
export interface Vehicle {
  id: number
  licensePlate: string
  model: string
  make: string
  year: number
  status: 'AVAILABLE' | 'IN_SERVICE' | 'MAINTENANCE' | 'OUT_OF_SERVICE'
  capacity: number
}

export interface Driver {
  id: number
  firstName: string
  lastName: string
  licenseNumber: string
  phone: string
  available: boolean
}

export interface Route {
  id: number
  name: string
  startLocation: string
  endLocation: string
  scheduledTime: string
  estimatedDistance: number
  driverId?: number
  vehicleId?: number
}

export interface Delivery {
  id: number
  recipientName: string
  address: string
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED'
  scheduledTime: string
  deliveredTime?: string
  routeId?: number
}

export interface SignupRequest {
  username: string
  email: string
  password: string
}
