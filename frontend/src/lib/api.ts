import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
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

export function unwrapApiData<T>(payload: T | ApiResponse<T> | null | undefined): T | undefined {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data
  }
  return payload ?? undefined
}

export function extractApiError(err: unknown, fallback = 'Request failed'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiResponse<unknown> | { message?: string } | undefined
    if (data && typeof data === 'object' && 'message' in data && data.message) {
      return String(data.message)
    }
    return err.message || fallback
  }
  if (err instanceof Error) return err.message
  return fallback
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
  getById: (id: number) => api.get<Delivery>(`/deliveries/${id}`),
  create: (d: Partial<Delivery>) => api.post<Delivery>('/deliveries', d),
  update: (id: number, d: Partial<Delivery>) => api.put<Delivery>(`/deliveries/${id}`, d),
  updateStatus: (id: number, status: Delivery['status']) =>
    api.patch<Delivery>(`/deliveries/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/deliveries/${id}`),
}

export interface AnalyticsSummary {
  vehicles: number
  availableVehicles: number
  drivers: number
  availableDrivers: number
  routes: number
  deliveries: number
  pending: number
  inTransit: number
  delivered: number
}

export const analyticsApi = {
  summary: () => api.get<ApiResponse<AnalyticsSummary>>('/analytics/summary'),
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
