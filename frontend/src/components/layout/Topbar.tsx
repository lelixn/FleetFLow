import { Bell, Search, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  subtitle?: string
}

export default function Topbar({ title, subtitle }: Props) {
  const navigate = useNavigate()

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

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555555]" />
          <input
            className="ff-input pl-8 w-52 text-[13px] h-8"
            placeholder="Search..."
          />
        </div>

        {/* Notification */}
        <button className="ff-btn ff-btn-ghost w-8 h-8 p-0">
          <Bell size={14} />
        </button>

        {/* Avatar + Logout */}
        <div className="flex items-center gap-2 ml-1 pl-3 border-l border-[#2a2a2a]">
          <div className="w-7 h-7 rounded-sm bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center ff-mono text-[11px] text-white">
            A
          </div>
          <button onClick={logout} className="ff-btn ff-btn-ghost w-8 h-8 p-0" title="Log out">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </header>
  )
}
