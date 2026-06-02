import Topbar from '../components/layout/Topbar'
import { Server, Shield, Sliders } from 'lucide-react'

export default function Settings() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Settings" subtitle="System configuration" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-4">
          {[
            {
              icon: Server,
              title: 'API Configuration',
              description: 'Backend API endpoint and connection settings.',
              value: 'http://localhost:8080',
              label: 'Base URL',
            },
            {
              icon: Shield,
              title: 'Authentication',
              description: 'JWT token management and session controls.',
              value: localStorage.getItem('ff_token') ? 'Token active' : 'Not authenticated',
              label: 'Status',
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
