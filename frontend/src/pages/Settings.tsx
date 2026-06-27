import Topbar from '../components/layout/Topbar'
import { Server, Shield, Sliders } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  getLiveRefreshEnabled,
  getLiveRefreshIntervalSec,
  setLiveRefreshEnabled,
  setLiveRefreshIntervalSec,
} from '../lib/live'

export default function Settings() {
  const [liveEnabled, setLiveEnabled] = useState(getLiveRefreshEnabled())
  const [liveInterval, setLiveInterval] = useState(getLiveRefreshIntervalSec())
  const token = localStorage.getItem('ff_token')
  const tokenPreview = useMemo(() => {
    if (!token) return 'Not authenticated'
    return `${token.slice(0, 14)}...`
  }, [token])

  function saveLiveSettings() {
    setLiveRefreshEnabled(liveEnabled)
    setLiveRefreshIntervalSec(liveInterval)
  }

  function resetLiveSettings() {
    setLiveEnabled(true)
    setLiveInterval(5)
    setLiveRefreshEnabled(true)
    setLiveRefreshIntervalSec(5)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Settings" subtitle="System configuration" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl space-y-4">
          <div className="ff-card p-5">
            <p className="text-[14px] font-medium text-white">Live Tracking Controls</p>
            <p className="text-[12px] text-[#555555] mt-0.5">
              Configure how frequently FleetFlow refreshes data from the backend.
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="ff-label block mb-1.5">Live Refresh</label>
                <select
                  className="ff-input"
                  value={liveEnabled ? 'enabled' : 'disabled'}
                  onChange={(e) => setLiveEnabled(e.target.value === 'enabled')}
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <div>
                <label className="ff-label block mb-1.5">Interval (seconds)</label>
                <input
                  className="ff-input"
                  type="number"
                  min={2}
                  max={60}
                  value={liveInterval}
                  onChange={(e) => setLiveInterval(Number(e.target.value) || 5)}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button className="ff-btn ff-btn-primary" onClick={saveLiveSettings}>Save Live Settings</button>
              <button className="ff-btn ff-btn-ghost" onClick={resetLiveSettings}>Reset</button>
            </div>
          </div>

          {[
            {
              icon: Server,
              title: 'API Configuration',
              description: 'Backend API endpoint and connection settings.',
              value: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
              label: 'Base URL',
            },
            {
              icon: Shield,
              title: 'Authentication',
              description: 'JWT token management and session controls.',
              value: tokenPreview,
              label: 'Token',
            },
            {
              icon: Sliders,
              title: 'UI Preferences',
              description: 'Theme and display preferences.',
              value: 'Dark · Mono · Minimal',
              label: 'Theme',
            },
          ].map(({ icon: Icon, title, description, value, label }) => (
            <div key={title} className="ff-card p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-sm bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} strokeWidth={1.6} className="text-[#555555]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-white">{title}</p>
                <p className="text-[12px] text-[#555555] mt-0.5">{description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="ff-label">{label}</span>
                  <span className="ff-mono text-[12px] text-[#888888]">{value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
