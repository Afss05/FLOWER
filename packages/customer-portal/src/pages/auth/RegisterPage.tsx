import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { register } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

export default function RegisterPage() {
  usePageTitle('Register')
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()

  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [phone, setPhone]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const res = await register({
        name,
        email,
        phone,
        password,
        password_confirmation: confirm,
      })
      setToken(res.data.token)
      setUser(res.data.user)
      navigate('/')
    } catch (err: any) {
      const data = err.response?.data
      if (data?.errors) {
        // Show field-level validation errors as a list
        const msgs = Object.values(data.errors as Record<string, string>).join(' · ')
        setError(msgs)
      } else {
        setError(data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="card p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-8">Register</h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

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
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              placeholder="9876543210"
              className="w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
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
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-red-700 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
