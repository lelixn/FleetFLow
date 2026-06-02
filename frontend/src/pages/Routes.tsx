import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, MapPin, ArrowRight } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { routesApi, type Route } from '../lib/api'
import { formatDateTime } from '../lib/utils'

const EMPTY: Partial<Route> = { name: '', startLocation: '', endLocation: '', estimatedDistance: 0, scheduledTime: '' }

export default function Routes() {
  const [routes, setRoutes]     = useState<Route[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState<Partial<Route>>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  async function load() {
    try { const { data } = await routesApi.getAll(); setRoutes(data) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() { setEditing(EMPTY); setModal(true) }
  function openEdit(r: Route) { setEditing(r); setModal(true) }

  async function save() {
    setSaving(true)
    try {
      if (editing.id) await routesApi.update(editing.id, editing)
      else await routesApi.create(editing)
      setModal(false); load()
    } finally { setSaving(false) }
  }

  async function remove(id: number) {
    await routesApi.delete(id); setDeleteId(null); load()
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Routes" subtitle={`${routes.length} configured`} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl">
          <div className="flex justify-end mb-4">
            <button onClick={openCreate} className="ff-btn ff-btn-primary"><Plus size={14} /> Add Route</button>
          </div>

          {loading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="ff-card h-14 animate-pulse" />)}</div>
          ) : routes.length === 0 ? (
            <EmptyState icon={MapPin} title="No routes yet" message="Configure delivery routes to get started." />
          ) : (
            <div className="ff-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    {['ID', 'Name', 'Route', 'Distance', 'Scheduled', ''].map(h => (
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
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#888888]">
                        {r.estimatedDistance ? `${r.estimatedDistance} km` : '—'}
                      </td>
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#555555]">
                        {r.scheduledTime ? formatDateTime(r.scheduledTime) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(r)} className="ff-btn ff-btn-ghost w-7 h-7 p-0"><Pencil size={12} /></button>
                          <button onClick={() => setDeleteId(r.id)} className="ff-btn ff-btn-danger w-7 h-7 p-0"><Trash2 size={12} /></button>
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

      <Modal open={modal} onClose={() => setModal(false)} title={editing.id ? `Edit Route #${editing.id}` : 'Add Route'}
        footer={<>
          <button onClick={() => setModal(false)} className="ff-btn ff-btn-ghost">Cancel</button>
          <button onClick={save} disabled={saving} className="ff-btn ff-btn-primary">{saving ? 'Saving…' : 'Save'}</button>
        </>}
      >
        <div className="space-y-3">
          {[
            { key: 'name',              label: 'Route Name'           },
            { key: 'startLocation',     label: 'Start Location'       },
            { key: 'endLocation',       label: 'End Location'         },
            { key: 'estimatedDistance', label: 'Distance (km)', type: 'number' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="ff-label block mb-1.5">{label}</label>
              <input type={type ?? 'text'} className="ff-input"
                value={(editing as Record<string, unknown>)[key] as string ?? ''}
                onChange={(e) => setEditing(p => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="ff-label block mb-1.5">Scheduled Time</label>
            <input type="datetime-local" className="ff-input"
              value={editing.scheduledTime ?? ''}
              onChange={(e) => setEditing(p => ({ ...p, scheduledTime: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Route"
        footer={<>
          <button onClick={() => setDeleteId(null)} className="ff-btn ff-btn-ghost">Cancel</button>
          <button onClick={() => deleteId !== null && remove(deleteId)} className="ff-btn ff-btn-danger">Delete</button>
        </>}
      >
        <p className="text-[13px] text-[#888888]">Delete route <span className="text-white">#{deleteId}</span> permanently?</p>
      </Modal>
    </div>
  )
}
