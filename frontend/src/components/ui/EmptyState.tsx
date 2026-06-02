import { type LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  message?: string
}

export default function EmptyState({ icon: Icon, title, message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-14 h-14 rounded-sm border border-[#2a2a2a] bg-[#111111] flex items-center justify-center">
        <Icon size={24} strokeWidth={1.4} className="text-[#333333]" />
      </div>
      <div className="text-center">
        <p className="text-[14px] text-white font-medium">{title}</p>
        {message && <p className="text-[13px] text-[#555555] mt-1">{message}</p>}
      </div>
    </div>
  )
}
