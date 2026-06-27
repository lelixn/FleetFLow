import { Bell, Search, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  subtitle?: string
}

export default function Topbar({ title, subtitle }: Props) {
  const navigate = useNavigate()
  const openPalette = () => window.dispatchEvent(new Event('ff-open-command-palette'))

  function logout() {
    localStorage.removeItem('ff_token')
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] bg-[#0a0a0a] shrink-0">
      <div>
        <h1 className="text-[15px] font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-[12px] text-[#555555] ff-mono mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="relative cursor-pointer" onClick={openPalette} title="Open Command Palette">
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#aaaaaa]" />
          <input
            className="ff-input pl-8 w-56 text-[13px] h-8 border-[#3a3a3a]"
            placeholder="Search... (Ctrl/Cmd + K)"
            readOnly
          />
        </button>

        {/* Notification */}
        <button className="ff-btn ff-btn-ghost w-9 h-9 p-0 text-white border-[#3a3a3a] bg-[#1a1a1a] hover:bg-[#2a2a2a]" title="Notifications">
          <Bell size={18} strokeWidth={2} />
        </button>

        {/* Avatar + Logout */}
        <div className="flex items-center gap-3 ml-1 pl-4 border-l border-[#2a2a2a]">
          <div className="w-8 h-8 rounded bg-[#1a1a1a] border border-[#3a3a3a] flex items-center justify-center ff-mono text-[12px] text-white font-semibold">
            A
          </div>
          <button onClick={logout} className="ff-btn ff-btn-ghost w-9 h-9 p-0 text-white border-[#3a3a3a] bg-[#1a1a1a] hover:bg-[#2a2a2a]" title="Log out">
            <LogOut size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  )
}
