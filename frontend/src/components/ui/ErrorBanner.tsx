import { AlertCircle, X } from 'lucide-react'

interface ErrorBannerProps {
  message: string
  onDismiss?: () => void
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null
  return (
    <div className="mb-4 flex items-start gap-2 rounded-sm border border-red-900/50 bg-red-950/30 px-4 py-3 text-[13px] text-red-300">
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="ff-btn ff-btn-ghost w-7 h-7 p-0 shrink-0">
          <X size={14} />
        </button>
      )}
    </div>
  )
}
