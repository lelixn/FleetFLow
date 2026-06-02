import { Link, Navigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, MapPinned, Zap } from 'lucide-react'

export default function Landing() {
  const token = localStorage.getItem('ff_token')
  if (token) return <Navigate to="/app" replace />

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-white flex items-center justify-center">
            <Zap size={14} strokeWidth={2.5} className="text-black" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">FleetFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="ff-btn ff-btn-ghost">Login</Link>
          <Link to="/signup" className="ff-btn ff-btn-primary">Sign up</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <p className="ff-label mb-3">Modern Fleet Command Center</p>
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight max-w-3xl">
          Simple black-and-white operations UI for routing, vehicles, and deliveries.
        </h1>
        <p className="text-[#888888] text-[15px] mt-5 max-w-2xl">
          Minimal interface, fast controls, and real-time operational clarity built for system-focused logistics teams.
        </p>
        <div className="flex items-center gap-3 mt-8">
          <Link to="/signup" className="ff-btn ff-btn-primary">
            Create account
            <ArrowRight size={14} />
          </Link>
          <Link to="/login" className="ff-btn ff-btn-ghost">I already have an account</Link>
        </div>

        <section className="grid md:grid-cols-3 gap-4 mt-14">
          {[
            {
              icon: Truck,
              title: 'Vehicle Control',
              desc: 'Track fleet readiness, service status, and capacity in one clean panel.',
            },
            {
              icon: MapPinned,
              title: 'Route Visibility',
              desc: 'Monitor route plans and assignment data with a no-noise workflow.',
            },
            {
              icon: ShieldCheck,
              title: 'Secure Access',
              desc: 'JWT-based auth with private app routes and protected API requests.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="ff-card p-5">
              <div className="w-8 h-8 rounded-sm bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                <Icon size={14} className="text-[#555555]" />
              </div>
              <h3 className="text-[15px] font-medium mt-4">{title}</h3>
              <p className="text-[13px] text-[#888888] mt-2">{desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
