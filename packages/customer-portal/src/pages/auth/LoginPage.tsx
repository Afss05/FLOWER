import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { login } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  usePageTitle('Login')
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login({ email, password })
      setToken(res.data.token)
      setUser(res.data.user)
      navigate('/')
    } catch (err: any) {
      const data = err.response?.data
      if (data?.errors) {
        const msgs = Object.values(data.errors as Record<string, string>).join(' · ')
        setError(msgs)
      } else {
        setError(data?.message || 'Login failed. Check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="card p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-8">Login</h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-700 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
