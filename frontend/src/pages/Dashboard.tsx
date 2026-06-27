import { useEffect, useState } from 'react'
import { Truck, Users, MapPin, Package, Activity, Clock } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { analyticsApi, deliveriesApi, driversApi, routesApi, vehiclesApi, type AnalyticsSummary, type Delivery, type Driver, type Route, type Vehicle, unwrapApiData } from '../lib/api'
import { useLiveConfig } from '../lib/live'
import { formatDateTime } from '../lib/utils'

interface Summary {
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

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const now = new Date().toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const { enabled: liveEnabled, intervalSec: refreshEverySec } = useLiveConfig()

  useEffect(() => {
    async function load(initial = false) {
      try {
        if (initial) setLoading(true)
        const [sumRes, delRes] = await Promise.allSettled([
          analyticsApi.summary(),
          deliveriesApi.getAll(),
        ])

        const deliveriesRaw = delRes.status === 'fulfilled' ? unwrapApiData<Delivery[]>(delRes.value.data) : []
        const deliveries = Array.isArray(deliveriesRaw) ? deliveriesRaw : []

        setRecentDeliveries(deliveries.slice(-6).reverse())

        if (sumRes.status === 'fulfilled') {
          const s = unwrapApiData<AnalyticsSummary>(sumRes.value.data)
          if (s) {
            setSummary(s)
            return
          }
        }

        // Fallback: compute summary from the older list endpoints.
        const [vRes, dRes, rRes] = await Promise.allSettled([
          vehiclesApi.getAll(),
          driversApi.getAll(),
          routesApi.getAll(),
        ])

        const vehiclesRaw = vRes.status === 'fulfilled' ? unwrapApiData<Vehicle[]>(vRes.value.data) : []
        const driversRaw = dRes.status === 'fulfilled' ? unwrapApiData<Driver[]>(dRes.value.data) : []
        const routesRaw = rRes.status === 'fulfilled' ? unwrapApiData<Route[]>(rRes.value.data) : []

        const vehicles = Array.isArray(vehiclesRaw) ? vehiclesRaw : []
        const drivers = Array.isArray(driversRaw) ? driversRaw : []
        const routes = Array.isArray(routesRaw) ? routesRaw : []

        setSummary({
          vehicles: vehicles.length,
          availableVehicles: vehicles.filter(v => v.status === 'AVAILABLE').length,
          drivers: drivers.length,
          availableDrivers: drivers.filter(d => d.available).length,
          routes: routes.length,
          deliveries: deliveries.length,
          pending: deliveries.filter(d => d.status === 'PENDING').length,
          inTransit: deliveries.filter(d => d.status === 'IN_TRANSIT').length,
          delivered: deliveries.filter(d => d.status === 'DELIVERED').length,
        })
        setLastUpdated(new Date())
      } finally {
        if (initial) setLoading(false)
      }
    }

    load(true)
    if (!liveEnabled) return
    const interval = window.setInterval(() => load(false), refreshEverySec * 1000)
    return () => window.clearInterval(interval)
  }, [liveEnabled, refreshEverySec])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Dashboard"
        subtitle={`${now} · ${liveEnabled ? `Live every ${refreshEverySec}s` : 'Live refresh off'}${lastUpdated ? ` · Updated ${lastUpdated.toLocaleTimeString()}` : ''}`}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="ff-card h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6 max-w-6xl">
            {/* Stat row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Vehicles"
                value={summary?.vehicles ?? 0}
                icon={Truck}
                delta={`${summary?.availableVehicles ?? 0} available`}
                positive
              />
              <StatCard
                label="Drivers"
                value={summary?.drivers ?? 0}
                icon={Users}
                delta={`${summary?.availableDrivers ?? 0} on duty`}
                positive
              />
              <StatCard
                label="Active Routes"
                value={summary?.routes ?? 0}
                icon={MapPin}
              />
              <StatCard
                label="Deliveries Today"
                value={summary?.deliveries ?? 0}
                icon={Package}
                delta={`${summary?.delivered ?? 0} completed`}
                positive
              />
            </div>

            {/* Delivery pipeline */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Pending',    value: summary?.pending ?? 0,   color: 'text-[#888888]'  },
                { label: 'In Transit', value: summary?.inTransit ?? 0, color: 'text-[#a8d4f0]'  },
                { label: 'Delivered',  value: summary?.delivered ?? 0, color: 'text-[#a8f0a8]'  },
              ].map(({ label, value, color }) => (
                <div key={label} className="ff-card-elevated p-4 flex flex-col gap-1">
                  <p className="ff-label">{label}</p>
                  <p className={`text-2xl font-semibold ff-mono ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Recent deliveries table */}
            <div className="ff-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-[#555555]" />
                  <p className="text-[13px] font-medium text-white">Recent Deliveries</p>
                </div>
                <p className="ff-label">Latest 6</p>
              </div>

              {recentDeliveries.length === 0 ? (
                <div className="flex flex-col items-center py-12 gap-2">
                  <Package size={28} strokeWidth={1.2} className="text-[#2a2a2a]" />
                  <p className="text-[13px] text-[#555555]">No deliveries recorded yet</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]">
                      {['ID', 'Recipient', 'Address', 'Status', 'Scheduled'].map(h => (
                        <th key={h} className="px-5 py-3 text-left ff-label">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentDeliveries.map((d) => (
                      <tr key={d.id} className="border-b border-[#111111] hover:bg-[#111111] transition-colors">
                        <td className="px-5 py-3 ff-mono text-[12px] text-[#555555]">#{d.id}</td>
                        <td className="px-5 py-3 text-[13px] text-white">{d.recipientName}</td>
                        <td className="px-5 py-3 text-[13px] text-[#888888] max-w-xs truncate">{d.address}</td>
                        <td className="px-5 py-3"><Badge status={d.status} /></td>
                        <td className="px-5 py-3 text-[12px] text-[#555555] ff-mono flex items-center gap-1.5">
                          <Clock size={11} />
                          {formatDateTime(d.scheduledTime)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
