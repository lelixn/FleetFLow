import { cn, statusColors } from '../../lib/utils'

interface Props {
  status: string
  className?: string
}

export default function Badge({ status, className }: Props) {
  return (
    <span className={cn('badge', statusColors[status] ?? 'bg-[#1a1a1a] text-[#888888] border border-[#2a2a2a]', className)}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
