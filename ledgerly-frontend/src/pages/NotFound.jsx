import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Logo from '../components/ui/Logo'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
      <Logo />
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-gold-400 ring-1 ring-inset ring-white/10">
        <Compass size={24} />
      </span>
      <div>
        <p className="font-display text-2xl font-semibold text-white">Page not found</p>
        <p className="mt-1.5 text-sm text-mist-500">The page you're looking for doesn't exist or has moved.</p>
      </div>
      <Link to="/" className="btn-primary">
        Back to dashboard
      </Link>
    </div>
  )
}
