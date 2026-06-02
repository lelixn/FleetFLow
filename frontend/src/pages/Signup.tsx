import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, Zap } from 'lucide-react'
import { authApi } from '../lib/api'

export default function Signup() {
  const token = localStorage.getItem('ff_token')
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (token) return <Navigate to="/app" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const { data } = await authApi.signup({ username, email, password })
      setSuccess(data.message || 'Signup successful. Please log in.')
      setTimeout(() => navigate('/login'), 700)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-md ff-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-sm bg-white flex items-center justify-center">
            <Zap size={14} strokeWidth={2.5} className="text-black" />
          </div>
          <span className="text-[15px] font-semibold text-white">FleetFlow</span>
        </div>

        <p className="ff-label mb-2">Create account</p>
        <h2 className="text-2xl font-semibold text-white mb-6">Sign up</h2>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded bg-[#2b0d0d] border border-[#4a1e1e] text-[#f0a8a8] text-[13px]">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 mb-4 rounded bg-[#0d2b0d] border border-[#1e4a1e] text-[#a8f0a8] text-[13px]">
            {success}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="ff-label block mb-2">Username</label>
            <input className="ff-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="ff-label block mb-2">Email</label>
            <input type="email" className="ff-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="ff-label block mb-2">Password</label>
            <input type="password" className="ff-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="ff-btn ff-btn-primary w-full mt-1" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign up'}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <p className="text-[13px] text-[#888888] mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-white underline underline-offset-4">Login</Link>
        </p>
      </div>
    </div>
  )
}
