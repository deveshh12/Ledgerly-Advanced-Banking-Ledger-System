import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles, Layers } from 'lucide-react'
import Logo from '../ui/Logo'

const POINTS = [
  { icon: ShieldCheck, text: 'HTTP-only JWT sessions with bcrypt-hashed credentials' },
  { icon: Layers, text: 'Immutable double-entry ledger — balances are always derived' },
  { icon: Sparkles, text: 'Idempotent transfers, deposits and withdrawals by design' }
]

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-white/[0.06] bg-ink-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
        <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative max-w-md">
          <p className="font-display text-3xl font-semibold leading-tight text-white">
            Private banking, engineered like a ledger.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-mist-500">
            Every rupee is traceable. Every transaction is idempotent. Ledgerly gives you a single,
            trustworthy view of your accounts.
          </p>
          <div className="mt-8 space-y-4">
            {POINTS.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-gold-400 ring-1 ring-inset ring-white/10">
                  <Icon size={15} />
                </span>
                <p className="text-sm text-mist-400">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-mist-500">© {new Date().getFullYear()} Ledgerly. Built for clarity.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-mist-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
