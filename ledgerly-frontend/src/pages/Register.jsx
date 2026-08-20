import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../components/layout/AuthLayout'
import Field from '../components/ui/Field'
import Spinner from '../components/ui/Spinner'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../api/client'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Name, email and password are required.')
      return
    }
    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }
    setSubmitting(true)
    try {
      const user = await register(form)
      toast.success(`Account created — welcome, ${user.name?.split(' ')[0] || 'there'}`)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="A primary INR account is opened for you automatically.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name">
          <input
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jordan Reyes"
            className="field-input"
          />
        </Field>
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
        <Field label="Password" hint="At least 6 characters.">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
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
              <UserPlus size={16} />
              Create account
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-mist-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-gold-400 hover:text-gold-500">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
