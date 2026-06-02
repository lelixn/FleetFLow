import { type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Props {
  label: string
  value: string | number
  icon: LucideIcon
  delta?: string
  positive?: boolean
  mono?: boolean
}

export default function StatCard({ label, value, icon: Icon, delta, positive, mono }: Props) {
  return (
    <div className="ff-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <p className="ff-label">{label}</p>
        <div className="w-8 h-8 rounded-sm bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
          <Icon size={15} strokeWidth={1.8} className="text-[#555555]" />
        </div>
      </div>
      <div>
        <p className={cn('text-3xl font-semibold text-white', mono && 'ff-mono')}>{value}</p>
        {delta && (
          <p className={cn('text-[11px] mt-1 ff-mono', positive ? 'text-[#a8f0a8]' : 'text-[#f0a8a8]')}>
            {delta}
          </p>
        )}
      </div>
    </div>
  )
}
