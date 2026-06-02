import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Truck } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { vehiclesApi, type Vehicle } from '../lib/api'

const STATUS_OPTIONS = ['AVAILABLE', 'IN_SERVICE', 'MAINTENANCE', 'OUT_OF_SERVICE']
const EMPTY: Partial<Vehicle> = { licensePlate: '', make: '', model: '', year: new Date().getFullYear(), status: 'AVAILABLE', capacity: 0 }

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState<Partial<Vehicle>>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  async function load() {
    try { const { data } = await vehiclesApi.getAll(); setVehicles(data) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() { setEditing(EMPTY); setModal(true) }
  function openEdit(v: Vehicle) { setEditing(v); setModal(true) }

  async function save() {
    setSaving(true)
    try {
      if (editing.id) {
        await vehiclesApi.update(editing.id, editing)
      } else {
        await vehiclesApi.create(editing)
      }
      setModal(false)
      load()
    } finally { setSaving(false) }
  }

  async function remove(id: number) {
    await vehiclesApi.delete(id)
    setDeleteId(null)
    load()
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Vehicles" subtitle={`${vehicles.length} registered`} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl">
          <div className="flex justify-end mb-4">
            <button onClick={openCreate} className="ff-btn ff-btn-primary">
              <Plus size={14} /> Add Vehicle
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="ff-card h-14 animate-pulse" />)}</div>
          ) : vehicles.length === 0 ? (
            <EmptyState icon={Truck} title="No vehicles yet" message="Add your first vehicle to get started." />
          ) : (
            <div className="ff-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    {['ID', 'License Plate', 'Make / Model', 'Year', 'Capacity', 'Status', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left ff-label">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id} className="border-b border-[#111111] hover:bg-[#111111] transition-colors">
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#555555]">#{v.id}</td>
                      <td className="px-5 py-3 ff-mono text-[13px] text-white">{v.licensePlate}</td>
                      <td className="px-5 py-3 text-[13px] text-white">{v.make} {v.model}</td>
                      <td className="px-5 py-3 ff-mono text-[13px] text-[#888888]">{v.year}</td>
                      <td className="px-5 py-3 ff-mono text-[13px] text-[#888888]">{v.capacity} t</td>
                      <td className="px-5 py-3"><Badge status={v.status} /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(v)} className="ff-btn ff-btn-ghost w-7 h-7 p-0">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => setDeleteId(v.id)} className="ff-btn ff-btn-danger w-7 h-7 p-0">
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

      {/* Create / Edit Modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing.id ? `Edit Vehicle #${editing.id}` : 'Add Vehicle'}
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
            { key: 'licensePlate', label: 'License Plate' },
            { key: 'make',         label: 'Make'          },
            { key: 'model',        label: 'Model'         },
            { key: 'year',         label: 'Year', type: 'number' },
            { key: 'capacity',     label: 'Capacity (tons)', type: 'number' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="ff-label block mb-1.5">{label}</label>
              <input
                type={type ?? 'text'}
                className="ff-input"
                value={(editing as Record<string, unknown>)[key] as string ?? ''}
                onChange={(e) => setEditing(p => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
              />
            </div>
          ))}
          <div>
            <label className="ff-label block mb-1.5">Status</label>
            <select
              className="ff-input"
              value={editing.status ?? 'AVAILABLE'}
              onChange={(e) => setEditing(p => ({ ...p, status: e.target.value as Vehicle['status'] }))}
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Vehicle"
        footer={
          <>
            <button onClick={() => setDeleteId(null)} className="ff-btn ff-btn-ghost">Cancel</button>
            <button onClick={() => deleteId !== null && remove(deleteId)} className="ff-btn ff-btn-danger">Delete</button>
          </>
        }
      >
        <p className="text-[13px] text-[#888888]">
          This action cannot be undone. Vehicle <span className="text-white">#{deleteId}</span> will be permanently removed.
        </p>
      </Modal>
    </div>
  )
}
