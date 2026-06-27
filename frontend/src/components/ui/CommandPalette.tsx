import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command, MapPin, Package, Search, Truck, Users, X } from 'lucide-react'
import {
  deliveriesApi,
  driversApi,
  routesApi,
  type Delivery,
  type Driver,
  type Route,
  type Vehicle,
  unwrapApiData,
  vehiclesApi,
} from '../../lib/api'

type PaletteItem = {
  id: string
  label: string
  sublabel: string
  to: string
  type: 'vehicle' | 'driver' | 'route' | 'delivery'
}

const OPEN_EVENT = 'ff-open-command-palette'

export default function CommandPalette() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<PaletteItem[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    function onOpenEvent() {
      setOpen(true)
    }

    window.addEventListener('keydown', onKeydown)
    window.addEventListener(OPEN_EVENT, onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener(OPEN_EVENT, onOpenEvent)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    async function hydrate() {
      setLoading(true)
      try {
        const [vRes, dRes, rRes, delRes] = await Promise.allSettled([
          vehiclesApi.getAll(),
          driversApi.getAll(),
          routesApi.getAll(),
          deliveriesApi.getAll(),
        ])

        const vehiclesRaw = vRes.status === 'fulfilled' ? unwrapApiData<Vehicle[]>(vRes.value.data) : []
        const driversRaw = dRes.status === 'fulfilled' ? unwrapApiData<Driver[]>(dRes.value.data) : []
        const routesRaw = rRes.status === 'fulfilled' ? unwrapApiData<Route[]>(rRes.value.data) : []
        const deliveriesRaw = delRes.status === 'fulfilled' ? unwrapApiData<Delivery[]>(delRes.value.data) : []

        const vehicles = Array.isArray(vehiclesRaw) ? vehiclesRaw : []
        const drivers = Array.isArray(driversRaw) ? driversRaw : []
        const routes = Array.isArray(routesRaw) ? routesRaw : []
        const deliveries = Array.isArray(deliveriesRaw) ? deliveriesRaw : []

        const builtItems: PaletteItem[] = [
          ...vehicles.map((v) => ({
            id: `vehicle-${v.id}`,
            label: v.licensePlate || `Vehicle #${v.id}`,
            sublabel: `${v.make} ${v.model}`.trim() || 'Vehicle',
            to: '/app/vehicles',
            type: 'vehicle' as const,
          })),
          ...drivers.map((d) => ({
            id: `driver-${d.id}`,
            label: `${d.firstName} ${d.lastName}`.trim() || `Driver #${d.id}`,
            sublabel: d.licenseNumber || 'Driver',
            to: '/app/drivers',
            type: 'driver' as const,
          })),
          ...routes.map((r) => ({
            id: `route-${r.id}`,
            label: r.name || `Route #${r.id}`,
            sublabel: `${r.startLocation || 'Start'} -> ${r.endLocation || 'End'}`,
            to: '/app/routes',
            type: 'route' as const,
          })),
          ...deliveries.map((d) => ({
            id: `delivery-${d.id}`,
            label: d.recipientName || `Delivery #${d.id}`,
            sublabel: d.address || d.status,
            to: '/app/deliveries',
            type: 'delivery' as const,
          })),
        ]

        setItems(builtItems)
      } finally {
        setLoading(false)
      }
    }

    hydrate()
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items.slice(0, 10)
    return items
      .filter((item) =>
        item.label.toLowerCase().includes(q) ||
        item.sublabel.toLowerCase().includes(q) ||
        item.type.includes(q),
      )
      .slice(0, 10)
  }, [items, query])

  function getIcon(type: PaletteItem['type']) {
    if (type === 'vehicle') return Truck
    if (type === 'driver') return Users
    if (type === 'route') return MapPin
    return Package
  }

  function go(to: string) {
    setOpen(false)
    setQuery('')
    navigate(to)
  }

  useEffect(() => {
    if (!open) return
    function onPaletteNav(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((prev) => Math.min(prev + 1, Math.max(filtered.length - 1, 0)))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault()
        go(filtered[activeIndex].to)
      }
    }
    window.addEventListener('keydown', onPaletteNav)
    return () => window.removeEventListener('keydown', onPaletteNav)
  }, [activeIndex, filtered, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/55 backdrop-blur-sm">
      <div className="w-full max-w-2xl ff-card overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#2a2a2a]">
          <Search size={14} className="text-[#555555]" />
          <input
            className="bg-transparent outline-none text-[14px] text-white flex-1"
            placeholder="Search vehicles, drivers, routes, deliveries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="ff-btn ff-btn-ghost w-7 h-7 p-0" onClick={() => setOpen(false)}>
            <X size={12} />
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-2">
          {loading ? (
            <div className="p-4 text-[12px] ff-mono text-[#555555]">Indexing data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-[12px] ff-mono text-[#555555]">No matches found</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = getIcon(item.type)
              const active = idx === activeIndex
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.to)}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 border ${
                    active ? 'bg-[#1a1a1a] border-[#3f3f3f]' : 'bg-transparent border-transparent hover:bg-[#111111]'
                  }`}
                >
                  <div className="w-7 h-7 rounded border border-[#2a2a2a] flex items-center justify-center">
                    <Icon size={13} className="text-[#888888]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-white truncate">{item.label}</p>
                    <p className="text-[11px] ff-mono text-[#555555] truncate">{item.sublabel}</p>
                  </div>
                  <span className="ff-label">{item.type}</span>
                </button>
              )
            })
          )}
        </div>

        <div className="px-3 py-2 border-t border-[#2a2a2a] flex items-center justify-between">
          <p className="ff-label">Quick Actions</p>
          <div className="flex items-center gap-1.5 text-[11px] ff-mono text-[#555555]">
            <Command size={12} />
            <span>Ctrl/Cmd + K</span>
          </div>
        </div>
      </div>
    </div>
  )
}
