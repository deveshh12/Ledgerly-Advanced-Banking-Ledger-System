import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../components/layout/AuthLayout'
import Field from '../components/ui/Field'
import Spinner from '../components/ui/Spinner'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../api/client'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.')
      return
    }
    setSubmitting(true)
    try {
      const user = await login(form)
      toast.success(`Welcome back, ${user.name?.split(' ')[0] || 'there'}`)
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to view your accounts and ledger activity.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="field-input"
          />
        </Field>
        <Field label="Password">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="field-input pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-500 hover:text-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        {error && <p className="text-sm font-medium text-rose-400">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? <Spinner className="h-4 w-4 text-ink-950" /> : (
            <>
              <LogIn size={16} />
              Sign in
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-mist-500">
        New to Ledgerly?{' '}
        <Link to="/register" className="font-semibold text-gold-400 hover:text-gold-500">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
