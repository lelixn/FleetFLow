import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Truck, Users, MapPin, Package,
  Settings, ChevronRight, Zap,
} from 'lucide-react'
import { cn } from '../../lib/utils'

const nav = [
  { to: '/app',              icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/vehicles',     icon: Truck,           label: 'Vehicles'  },
  { to: '/app/drivers',      icon: Users,           label: 'Drivers'   },
  { to: '/app/routes',       icon: MapPin,          label: 'Routes'    },
  { to: '/app/deliveries',   icon: Package,         label: 'Deliveries'},
]

export default function Sidebar() {
  return (
    <aside className="flex flex-col w-56 shrink-0 border-r border-[#2a2a2a] bg-[#0a0a0a] h-full">
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-[#2a2a2a]">
        <div className="w-7 h-7 rounded-sm bg-white flex items-center justify-center">
          <Zap size={14} strokeWidth={2.5} className="text-black" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-white">FleetFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        <p className="ff-label px-2 mb-3">Navigation</p>
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/app'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-2.5 px-2 py-2 rounded text-[13px] transition-all',
                isActive
                  ? 'bg-white text-black font-medium'
                  : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-[#f0f0f0]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} strokeWidth={1.8} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={12} className="opacity-50" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#2a2a2a]">
        <NavLink
          to="/app/settings"
          className="flex items-center gap-2.5 px-2 py-2 rounded text-[13px] text-[#555555] hover:bg-[#1a1a1a] hover:text-[#f0f0f0] transition-all"
        >
          <Settings size={15} strokeWidth={1.8} />
          Settings
        </NavLink>
        <div className="mt-3 px-2 py-2 rounded bg-[#111111] border border-[#2a2a2a]">
          <p className="ff-label mb-0.5">System</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a8f0a8] animate-pulse" />
            <span className="text-[11px] text-[#a8f0a8] ff-mono">Backend online</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
