import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, AlertCircle } from 'lucide-react'
import { authApi } from '../lib/api'

export default function Login() {
  const token = localStorage.getItem('ff_token')
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (token) return <Navigate to="/app" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await authApi.login(username, password)
      localStorage.setItem('ff_token', data.data.token)
      navigate('/app')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col w-80 border-r border-[#2a2a2a] p-10 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-white flex items-center justify-center">
            <Zap size={14} strokeWidth={2.5} className="text-black" />
          </div>
          <span className="text-[15px] font-semibold text-white">FleetFlow</span>
        </div>
        <div>
          <p className="ff-label mb-3">System Status</p>
          <div className="space-y-2">
            {['API Gateway', 'Route Engine', 'Tracking'].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a8f0a8]" />
                <span className="ff-mono text-[11px] text-[#555555]">{s}</span>
              </div>
            ))}
          </div>
          <p className="ff-mono text-[11px] text-[#333333] mt-6">v1.0.0 — FleetFlow OS</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 rounded-sm bg-white flex items-center justify-center">
              <Zap size={14} strokeWidth={2.5} className="text-black" />
            </div>
            <span className="text-[15px] font-semibold text-white">FleetFlow</span>
          </div>

          <p className="ff-label mb-2">Welcome back</p>
          <h2 className="text-2xl font-semibold text-white mb-8">Sign in to your account</h2>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded bg-[#2b0d0d] border border-[#4a1e1e] text-[#f0a8a8] text-[13px]">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="ff-label block mb-2">Username</label>
              <input
                className="ff-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="ff-label block mb-2">Password</label>
              <input
                type="password"
                className="ff-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="ff-btn ff-btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <p className="ff-mono text-[11px] text-[#333333] text-center mt-8">
            Fleet Management System · © 2026
          </p>
          <p className="text-[13px] text-[#888888] text-center mt-3">
            New here?{' '}
            <Link to="/signup" className="text-white underline underline-offset-4">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
