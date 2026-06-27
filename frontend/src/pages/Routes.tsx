import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, MapPin, ArrowRight } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import EmptyState from '../components/ui/EmptyState'
import ErrorBanner from '../components/ui/ErrorBanner'
import Modal from '../components/ui/Modal'
import {
  routesApi,
  driversApi,
  vehiclesApi,
  type Route,
  type Driver,
  type Vehicle,
  extractApiError,
  unwrapApiData,
} from '../lib/api'
import { useLiveConfig } from '../lib/live'
import { formatDateTime } from '../lib/utils'

const EMPTY: Partial<Route> = {
  name: '',
  startLocation: '',
  endLocation: '',
  estimatedDistance: 0,
  scheduledTime: '',
  driverId: undefined,
  vehicleId: undefined,
}

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Route>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const { enabled: liveEnabled, intervalSec: refreshEverySec } = useLiveConfig()

  async function load(initial = false) {
    try {
      if (initial) setLoading(true)
      const [routesRes, driversRes, vehiclesRes] = await Promise.all([
        routesApi.getAll(),
        driversApi.getAll(),
        vehiclesApi.getAll(),
      ])
      const list = unwrapApiData<Route[]>(routesRes.data)
      const driverList = unwrapApiData<Driver[]>(driversRes.data)
      const vehicleList = unwrapApiData<Vehicle[]>(vehiclesRes.data)
      setRoutes(Array.isArray(list) ? list : [])
      setDrivers(Array.isArray(driverList) ? driverList : [])
      setVehicles(Array.isArray(vehicleList) ? vehicleList : [])
      setLastUpdated(new Date())
      setError('')
    } catch (err) {
      setRoutes([])
      if (initial) setError(extractApiError(err, 'Failed to load routes'))
    } finally {
      if (initial) setLoading(false)
    }
  }

  useEffect(() => {
    load(true)
    if (!liveEnabled) return
    const interval = window.setInterval(() => load(false), refreshEverySec * 1000)
    return () => window.clearInterval(interval)
  }, [liveEnabled, refreshEverySec])

  function openCreate() {
    setEditing(EMPTY)
    setModal(true)
  }

  function openEdit(r: Route) {
    setEditing({
      ...r,
      scheduledTime: r.scheduledTime?.slice(0, 16) ?? '',
    })
    setModal(true)
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...editing,
        driverId: editing.driverId ? Number(editing.driverId) : undefined,
        vehicleId: editing.vehicleId ? Number(editing.vehicleId) : undefined,
      }
      if (editing.id) await routesApi.update(editing.id, payload)
      else await routesApi.create(payload)
      setModal(false)
      await load()
    } catch (err) {
      setError(extractApiError(err, 'Failed to save route'))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    setError('')
    try {
      await routesApi.delete(id)
      setDeleteId(null)
      await load()
    } catch (err) {
      setError(extractApiError(err, 'Failed to delete route'))
    }
  }

  function driverLabel(id?: number) {
    if (!id) return '—'
    const d = drivers.find((x) => x.id === id)
    return d ? `${d.firstName} ${d.lastName}` : `#${id}`
  }

  function vehicleLabel(id?: number) {
    if (!id) return '—'
    const v = vehicles.find((x) => x.id === id)
    return v ? v.licensePlate : `#${id}`
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Routes"
        subtitle={`${routes.length} configured · ${liveEnabled ? `Live ${refreshEverySec}s` : 'Live refresh off'}${lastUpdated ? ` · Updated ${lastUpdated.toLocaleTimeString()}` : ''}`}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl">
          <ErrorBanner message={error} onDismiss={() => setError('')} />

          <div className="flex justify-end mb-4">
            <button onClick={openCreate} className="ff-btn ff-btn-primary">
              <Plus size={14} /> Add Route
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="ff-card h-14 animate-pulse" />
              ))}
            </div>
          ) : routes.length === 0 ? (
            <EmptyState icon={MapPin} title="No routes yet" message="Configure delivery routes to get started." />
          ) : (
            <div className="ff-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    {['ID', 'Name', 'Route', 'Driver', 'Vehicle', 'Distance', 'Scheduled', ''].map((h) => (
                      <th key={h} className="px-5 py-3 text-left ff-label">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {routes.map((r) => (
                    <tr key={r.id} className="border-b border-[#111111] hover:bg-[#111111] transition-colors">
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#555555]">#{r.id}</td>
                      <td className="px-5 py-3 text-[13px] text-white font-medium">{r.name}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-[12px] text-[#888888] ff-mono">
                          <span className="max-w-[100px] truncate">{r.startLocation}</span>
                          <ArrowRight size={10} className="shrink-0" />
                          <span className="max-w-[100px] truncate">{r.endLocation}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#888888]">{driverLabel(r.driverId)}</td>
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#888888]">{vehicleLabel(r.vehicleId)}</td>
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#888888]">
                        {r.estimatedDistance ? `${r.estimatedDistance} km` : '—'}
                      </td>
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#555555]">
                        {r.scheduledTime ? formatDateTime(r.scheduledTime) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(r)} className="ff-btn ff-btn-ghost w-7 h-7 p-0">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => setDeleteId(r.id)} className="ff-btn ff-btn-danger w-7 h-7 p-0">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing.id ? `Edit Route #${editing.id}` : 'Add Route'}
        footer={
          <>
            <button onClick={() => setModal(false)} className="ff-btn ff-btn-ghost">Cancel</button>
            <button onClick={save} disabled={saving} className="ff-btn ff-btn-primary">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          {[
            { key: 'name', label: 'Route Name' },
            { key: 'startLocation', label: 'Start Location' },
            { key: 'endLocation', label: 'End Location' },
            { key: 'estimatedDistance', label: 'Distance (km)', type: 'number' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="ff-label block mb-1.5">{label}</label>
              <input
                type={type ?? 'text'}
                className="ff-input"
                value={(editing as Record<string, unknown>)[key] as string ?? ''}
                onChange={(e) =>
                  setEditing((p) => ({
                    ...p,
                    [key]: type === 'number' ? Number(e.target.value) : e.target.value,
                  }))
                }
              />
            </div>
          ))}
          <div>
            <label className="ff-label block mb-1.5">Driver</label>
            <select
              className="ff-input"
              value={editing.driverId ?? ''}
              onChange={(e) =>
                setEditing((p) => ({
                  ...p,
                  driverId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            >
              <option value="">Unassigned</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.firstName} {d.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="ff-label block mb-1.5">Vehicle</label>
            <select
              className="ff-input"
              value={editing.vehicleId ?? ''}
              onChange={(e) =>
                setEditing((p) => ({
                  ...p,
                  vehicleId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            >
              <option value="">Unassigned</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.licensePlate} · {v.make} {v.model}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="ff-label block mb-1.5">Scheduled Time</label>
            <input
              type="datetime-local"
              className="ff-input"
              value={editing.scheduledTime ?? ''}
              onChange={(e) => setEditing((p) => ({ ...p, scheduledTime: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Route"
        footer={
          <>
            <button onClick={() => setDeleteId(null)} className="ff-btn ff-btn-ghost">Cancel</button>
            <button onClick={() => deleteId !== null && remove(deleteId)} className="ff-btn ff-btn-danger">
              Delete
            </button>
          </>
        }
      >
        <p className="text-[13px] text-[#888888]">
          Delete route <span className="text-white">#{deleteId}</span> permanently?
        </p>
      </Modal>
    </div>
  )
}
