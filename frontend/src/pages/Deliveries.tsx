import { useEffect, useState } from 'react'
import { Plus, Package, Clock, Pencil, Trash2, Truck, CheckCircle } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import ErrorBanner from '../components/ui/ErrorBanner'
import Modal from '../components/ui/Modal'
import {
  deliveriesApi,
  routesApi,
  type Delivery,
  type Route,
  extractApiError,
  unwrapApiData,
} from '../lib/api'
import { useLiveConfig } from '../lib/live'
import { formatDateTime } from '../lib/utils'

const STATUS_FILTER = ['ALL', 'PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'] as const
type Filter = typeof STATUS_FILTER[number]

const EMPTY: Partial<Delivery> = {
  recipientName: '',
  address: '',
  scheduledTime: '',
  routeId: undefined,
}

const NEXT_STATUS: Partial<Record<Delivery['status'], Delivery['status']>> = {
  PENDING: 'IN_TRANSIT',
  IN_TRANSIT: 'DELIVERED',
}

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [filter, setFilter] = useState<Filter>('ALL')
  const [error, setError] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Delivery>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const { enabled: liveEnabled, intervalSec: refreshEverySec } = useLiveConfig()

  async function load(initial = false) {
    if (initial) setLoading(true)
    try {
      const [deliveriesRes, routesRes] = await Promise.all([
        deliveriesApi.getAll(),
        routesApi.getAll(),
      ])
      const list = unwrapApiData<Delivery[]>(deliveriesRes.data)
      const routeList = unwrapApiData<Route[]>(routesRes.data)
      setDeliveries(Array.isArray(list) ? list : [])
      setRoutes(Array.isArray(routeList) ? routeList : [])
      setLastUpdated(new Date())
      setError('')
    } catch (err) {
      setDeliveries([])
      if (initial) setError(extractApiError(err, 'Failed to load deliveries'))
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

  function openEdit(d: Delivery) {
    setEditing({
      ...d,
      scheduledTime: d.scheduledTime?.slice(0, 16) ?? '',
    })
    setModal(true)
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...editing,
        routeId: editing.routeId ? Number(editing.routeId) : undefined,
      }
      if (editing.id) await deliveriesApi.update(editing.id, payload)
      else await deliveriesApi.create(payload)
      setModal(false)
      await load()
    } catch (err) {
      setError(extractApiError(err, 'Failed to save delivery'))
    } finally {
      setSaving(false)
    }
  }

  async function advanceStatus(id: number, status: Delivery['status']) {
    setError('')
    try {
      await deliveriesApi.updateStatus(id, status)
      await load()
    } catch (err) {
      setError(extractApiError(err, 'Failed to update status'))
    }
  }

  async function remove(id: number) {
    setError('')
    try {
      await deliveriesApi.delete(id)
      setDeleteId(null)
      await load()
    } catch (err) {
      setError(extractApiError(err, 'Failed to delete delivery'))
    }
  }

  const shown = filter === 'ALL' ? deliveries : deliveries.filter((d) => d.status === filter)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Deliveries"
        subtitle={`${deliveries.length} total · ${liveEnabled ? `Live ${refreshEverySec}s` : 'Live refresh off'}${lastUpdated ? ` · Updated ${lastUpdated.toLocaleTimeString()}` : ''}`}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl">
          <ErrorBanner message={error} onDismiss={() => setError('')} />

          <div className="flex items-center gap-1 mb-4">
            {STATUS_FILTER.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`ff-btn text-[11px] h-7 px-3 ${filter === s ? 'ff-btn-primary' : 'ff-btn-ghost'}`}
              >
                {s.replace(/_/g, ' ')}
              </button>
            ))}
            <span className="ml-auto ff-label">{shown.length} items</span>
            <button onClick={openCreate} className="ff-btn ff-btn-primary ml-2">
              <Plus size={14} /> Add Delivery
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="ff-card h-14 animate-pulse" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No deliveries"
              message={
                filter !== 'ALL'
                  ? `No ${filter.replace(/_/g, ' ').toLowerCase()} deliveries.`
                  : 'Create a delivery to start tracking shipments.'
              }
            />
          ) : (
            <div className="ff-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    {['ID', 'Recipient', 'Address', 'Route', 'Status', 'Scheduled', 'Delivered', ''].map((h) => (
                      <th key={h} className="px-5 py-3 text-left ff-label">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shown.map((d) => (
                    <tr key={d.id} className="border-b border-[#111111] hover:bg-[#111111] transition-colors">
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#555555]">#{d.id}</td>
                      <td className="px-5 py-3 text-[13px] text-white">{d.recipientName}</td>
                      <td className="px-5 py-3 text-[13px] text-[#888888] max-w-xs truncate">{d.address}</td>
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#555555]">
                        {d.routeId ? `#${d.routeId}` : '—'}
                      </td>
                      <td className="px-5 py-3"><Badge status={d.status} /></td>
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#555555]">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={10} />
                          {formatDateTime(d.scheduledTime)}
                        </span>
                      </td>
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#555555]">
                        {d.deliveredTime ? formatDateTime(d.deliveredTime) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          {NEXT_STATUS[d.status] && (
                            <button
                              onClick={() => advanceStatus(d.id, NEXT_STATUS[d.status]!)}
                              className="ff-btn ff-btn-ghost w-7 h-7 p-0"
                              title={`Mark ${NEXT_STATUS[d.status]}`}
                            >
                              {d.status === 'PENDING' ? <Truck size={12} /> : <CheckCircle size={12} />}
                            </button>
                          )}
                          {d.status !== 'DELIVERED' && d.status !== 'FAILED' && (
                            <button
                              onClick={() => advanceStatus(d.id, 'FAILED')}
                              className="ff-btn ff-btn-danger w-7 h-7 p-0 text-[10px]"
                              title="Mark failed"
                            >
                              !
                            </button>
                          )}
                          <button onClick={() => openEdit(d)} className="ff-btn ff-btn-ghost w-7 h-7 p-0">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => setDeleteId(d.id)} className="ff-btn ff-btn-danger w-7 h-7 p-0">
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
        title={editing.id ? `Edit Delivery #${editing.id}` : 'Add Delivery'}
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
          <div>
            <label className="ff-label block mb-1.5">Recipient</label>
            <input
              className="ff-input"
              value={editing.recipientName ?? ''}
              onChange={(e) => setEditing((p) => ({ ...p, recipientName: e.target.value }))}
            />
          </div>
          <div>
            <label className="ff-label block mb-1.5">Address</label>
            <input
              className="ff-input"
              value={editing.address ?? ''}
              onChange={(e) => setEditing((p) => ({ ...p, address: e.target.value }))}
            />
          </div>
          <div>
            <label className="ff-label block mb-1.5">Route</label>
            <select
              className="ff-input"
              value={editing.routeId ?? ''}
              onChange={(e) =>
                setEditing((p) => ({
                  ...p,
                  routeId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            >
              <option value="">Unassigned</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  #{r.id} · {r.name}
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
        title="Delete Delivery"
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
          Delete delivery <span className="text-white">#{deleteId}</span> permanently?
        </p>
      </Modal>
    </div>
  )
}
