import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { driversApi, type Driver } from '../lib/api'

const EMPTY: Partial<Driver> = { firstName: '', lastName: '', licenseNumber: '', phone: '', available: true }

export default function Drivers() {
  const [drivers, setDrivers]   = useState<Driver[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState<Partial<Driver>>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  async function load() {
    try { const { data } = await driversApi.getAll(); setDrivers(data) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() { setEditing(EMPTY); setModal(true) }
  function openEdit(d: Driver) { setEditing(d); setModal(true) }

  async function save() {
    setSaving(true)
    try {
      if (editing.id) await driversApi.update(editing.id, editing)
      else await driversApi.create(editing)
      setModal(false); load()
    } finally { setSaving(false) }
  }

  async function remove(id: number) {
    await driversApi.delete(id)
    setDeleteId(null); load()
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Drivers" subtitle={`${drivers.length} registered · ${drivers.filter(d => d.available).length} available`} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl">
          <div className="flex justify-end mb-4">
            <button onClick={openCreate} className="ff-btn ff-btn-primary"><Plus size={14} /> Add Driver</button>
          </div>

          {loading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="ff-card h-14 animate-pulse" />)}</div>
          ) : drivers.length === 0 ? (
            <EmptyState icon={Users} title="No drivers yet" message="Add drivers to assign to routes." />
          ) : (
            <div className="ff-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    {['ID', 'Name', 'License', 'Phone', 'Status', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left ff-label">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((d) => (
                    <tr key={d.id} className="border-b border-[#111111] hover:bg-[#111111] transition-colors">
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#555555]">#{d.id}</td>
                      <td className="px-5 py-3 text-[13px] text-white">{d.firstName} {d.lastName}</td>
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#888888]">{d.licenseNumber}</td>
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#888888]">{d.phone}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${d.available ? 'bg-[#0d2b0d] text-[#a8f0a8] border border-[#1e4a1e]' : 'bg-[#2b0d0d] text-[#f0a8a8] border border-[#4a1e1e]'}`}>
                          {d.available ? 'AVAILABLE' : 'ON ROUTE'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(d)} className="ff-btn ff-btn-ghost w-7 h-7 p-0"><Pencil size={12} /></button>
                          <button onClick={() => setDeleteId(d.id)} className="ff-btn ff-btn-danger w-7 h-7 p-0"><Trash2 size={12} /></button>
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

      <Modal open={modal} onClose={() => setModal(false)} title={editing.id ? `Edit Driver #${editing.id}` : 'Add Driver'}
        footer={<>
          <button onClick={() => setModal(false)} className="ff-btn ff-btn-ghost">Cancel</button>
          <button onClick={save} disabled={saving} className="ff-btn ff-btn-primary">{saving ? 'Saving…' : 'Save'}</button>
        </>}
      >
        <div className="space-y-3">
          {[
            { key: 'firstName',     label: 'First Name'      },
            { key: 'lastName',      label: 'Last Name'       },
            { key: 'licenseNumber', label: 'License Number'  },
            { key: 'phone',         label: 'Phone'           },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="ff-label block mb-1.5">{label}</label>
              <input className="ff-input" value={(editing as Record<string, unknown>)[key] as string ?? ''}
                onChange={(e) => setEditing(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="ff-label block mb-1.5">Availability</label>
            <select className="ff-input" value={editing.available ? 'true' : 'false'}
              onChange={(e) => setEditing(p => ({ ...p, available: e.target.value === 'true' }))}>
              <option value="true">Available</option>
              <option value="false">On Route</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Remove Driver"
        footer={<>
          <button onClick={() => setDeleteId(null)} className="ff-btn ff-btn-ghost">Cancel</button>
          <button onClick={() => deleteId !== null && remove(deleteId)} className="ff-btn ff-btn-danger">Remove</button>
        </>}
      >
        <p className="text-[13px] text-[#888888]">Remove driver <span className="text-white">#{deleteId}</span> permanently?</p>
      </Modal>
    </div>
  )
}
