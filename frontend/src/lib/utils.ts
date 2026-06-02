import clsx, { type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export const statusColors: Record<string, string> = {
  AVAILABLE:       'bg-[#0d2b0d] text-[#a8f0a8] border border-[#1e4a1e]',
  IN_SERVICE:      'bg-[#0d1f2b] text-[#a8d4f0] border border-[#1e3a4a]',
  MAINTENANCE:     'bg-[#2b240d] text-[#f0e0a8] border border-[#4a3e1e]',
  OUT_OF_SERVICE:  'bg-[#2b0d0d] text-[#f0a8a8] border border-[#4a1e1e]',
  PENDING:         'bg-[#1a1a1a] text-[#888888] border border-[#2a2a2a]',
  IN_TRANSIT:      'bg-[#0d1f2b] text-[#a8d4f0] border border-[#1e3a4a]',
  DELIVERED:       'bg-[#0d2b0d] text-[#a8f0a8] border border-[#1e4a1e]',
  FAILED:          'bg-[#2b0d0d] text-[#f0a8a8] border border-[#4a1e1e]',
}
