import { useState, useRef, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, ChevronDown, ArrowDownToLine, ArrowUpFromLine, Send, PlusCircle } from 'lucide-react'
import Sidebar from './Sidebar'
import MoneyActionModal from '../MoneyActionModal'
import { LedgerProvider } from '../../context/LedgerContext'
import { ActionsProvider, useActions } from '../../context/ActionsContext'

const TITLES = {
  '/': 'Dashboard',
  '/accounts': 'Accounts',
  '/transactions': 'Transactions'
}

function QuickActions() {
  const { openDeposit, openWithdraw, openTransfer, openCreateAccount } = useActions()
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const items = [
    { label: 'Deposit', icon: ArrowDownToLine, action: openDeposit },
    { label: 'Withdraw', icon: ArrowUpFromLine, action: openWithdraw },
    { label: 'Transfer', icon: Send, action: () => openTransfer('') },
    { label: 'New account', icon: PlusCircle, action: openCreateAccount }
  ]

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setMenuOpen((v) => !v)} className="btn-primary">
        New transaction
        <ChevronDown size={15} className={`transition ${menuOpen ? 'rotate-180' : ''}`} />
      </button>
      {menuOpen && (
        <div className="glass-panel absolute right-0 z-20 mt-2 w-52 overflow-hidden p-1.5">
          {items.map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              onClick={() => {
                action()
                setMenuOpen(false)
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-mist-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Icon size={16} className="text-gold-400" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const title = TITLES[location.pathname] || 'Ledgerly'

  return (
    <LedgerProvider>
      <ActionsProvider>
        <div className="min-h-screen lg:flex">
          <aside className="hidden w-64 shrink-0 border-r border-white/[0.06] bg-ink-900/60 backdrop-blur-xl lg:block">
            <div className="fixed h-screen w-64">
              <Sidebar />
            </div>
          </aside>

          {mobileOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-72 bg-ink-900 shadow-2xl">
                <Sidebar onNavigate={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
              </div>
            </div>
          )}

          <div className="flex min-h-screen flex-1 flex-col">
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-ink-950/80 px-4 py-4 backdrop-blur-xl sm:px-8">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-mist-400 hover:bg-white/[0.06] hover:text-white lg:hidden">
                  <Menu size={20} />
                </button>
                <h1 className="font-display text-xl font-semibold text-white sm:text-2xl">{title}</h1>
              </div>
              <QuickActions />
            </header>

            <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
              <Outlet />
            </main>
          </div>
        </div>
        <MoneyActionModal />
      </ActionsProvider>
    </LedgerProvider>
  )
}
