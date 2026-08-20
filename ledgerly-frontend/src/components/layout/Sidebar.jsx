import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Wallet, History, LogOut, X } from 'lucide-react'
import Logo from '../ui/Logo'
import { useAuth } from '../../context/AuthContext'
import { initials } from '../../lib/format'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/transactions', label: 'Transactions', icon: History }
]

export default function Sidebar({ onNavigate, onClose }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pb-6 pt-6">
        <Logo />
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-mist-500 hover:bg-white/[0.06] hover:text-white lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-gold-500/15 to-transparent text-white ring-1 ring-inset ring-gold-500/25'
                  : 'text-mist-400 hover:bg-white/[0.05] hover:text-white'
              }`
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 rounded-xl px-2.5 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-gold-400 to-gold-600 text-xs font-bold text-ink-950">
            {initials(user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.name || 'Account holder'}</p>
            <p className="truncate text-xs text-mist-500">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-mist-400 transition hover:bg-rose-500/10 hover:text-rose-400"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </div>
  )
}
