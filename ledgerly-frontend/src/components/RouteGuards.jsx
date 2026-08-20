import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './ui/Spinner'
import Logo from './ui/Logo'

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Logo />
      <Spinner className="h-6 w-6 text-gold-400" />
    </div>
  )
}

export function ProtectedRoute() {
  const { status } = useAuth()
  if (status === 'checking') return <FullScreenLoader />
  if (status === 'unauthenticated') return <Navigate to="/login" replace />
  return <Outlet />
}

export function GuestRoute() {
  const { status } = useAuth()
  if (status === 'checking') return <FullScreenLoader />
  if (status === 'authenticated') return <Navigate to="/" replace />
  return <Outlet />
}
