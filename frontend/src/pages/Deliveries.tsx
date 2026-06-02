import { useEffect, useState } from 'react'
import { Package, Clock } from 'lucide-react'
import Topbar from '../components/layout/Topbar'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { deliveriesApi, type Delivery } from '../lib/api'
import { formatDateTime } from '../lib/utils'

const STATUS_FILTER = ['ALL', 'PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED'] as const
type Filter = typeof STATUS_FILTER[number]

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState<Filter>('ALL')

  useEffect(() => {
    deliveriesApi.getAll()
      .then(r => setDeliveries(r.data))
      .finally(() => setLoading(false))
  }, [])

  const shown = filter === 'ALL' ? deliveries : deliveries.filter(d => d.status === filter)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Deliveries" subtitle={`${deliveries.length} total`} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 mb-4">
            {STATUS_FILTER.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`ff-btn text-[11px] h-7 px-3 ${filter === s ? 'ff-btn-primary' : 'ff-btn-ghost'}`}>
                {s.replace(/_/g, ' ')}
              </button>
            ))}
            <span className="ml-auto ff-label">{shown.length} items</span>
          </div>

          {loading ? (
            <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="ff-card h-14 animate-pulse" />)}</div>
          ) : shown.length === 0 ? (
            <EmptyState icon={Package} title="No deliveries" message={filter !== 'ALL' ? `No ${filter.replace(/_/g, ' ').toLowerCase()} deliveries.` : 'No deliveries recorded.'} />
          ) : (
            <div className="ff-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    {['ID', 'Recipient', 'Address', 'Status', 'Scheduled', 'Delivered'].map(h => (
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
                      <td className="px-5 py-3"><Badge status={d.status} /></td>
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#555555] flex items-center gap-1">
                        <Clock size={10} />{formatDateTime(d.scheduledTime)}
                      </td>
                      <td className="px-5 py-3 ff-mono text-[12px] text-[#555555]">
                        {d.deliveredTime ? formatDateTime(d.deliveredTime) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
