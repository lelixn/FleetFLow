import { useEffect, useState } from 'react'

export const LIVE_REFRESH_ENABLED_KEY = 'ff_live_refresh_enabled'
export const LIVE_REFRESH_INTERVAL_KEY = 'ff_live_refresh_interval_sec'
export const LIVE_CONFIG_CHANGED = 'ff-live-config-changed'

export function getLiveRefreshEnabled(): boolean {
  const value = localStorage.getItem(LIVE_REFRESH_ENABLED_KEY)
  if (value === null) return true
  return value === 'true'
}

export function setLiveRefreshEnabled(enabled: boolean) {
  localStorage.setItem(LIVE_REFRESH_ENABLED_KEY, String(enabled))
  notifyLiveConfigChanged()
}

export function getLiveRefreshIntervalSec(): number {
  const value = Number(localStorage.getItem(LIVE_REFRESH_INTERVAL_KEY) || '5')
  if (!Number.isFinite(value)) return 5
  return Math.min(60, Math.max(2, value))
}

export function setLiveRefreshIntervalSec(sec: number) {
  const normalized = Math.min(60, Math.max(2, sec))
  localStorage.setItem(LIVE_REFRESH_INTERVAL_KEY, String(normalized))
  notifyLiveConfigChanged()
}

export function notifyLiveConfigChanged() {
  window.dispatchEvent(new Event(LIVE_CONFIG_CHANGED))
}

export function useLiveConfig() {
  const [, tick] = useState(0)
  useEffect(() => {
    const handler = () => tick((n) => n + 1)
    window.addEventListener(LIVE_CONFIG_CHANGED, handler)
    return () => window.removeEventListener(LIVE_CONFIG_CHANGED, handler)
  }, [])
  return {
    enabled: getLiveRefreshEnabled(),
    intervalSec: getLiveRefreshIntervalSec(),
  }
}
