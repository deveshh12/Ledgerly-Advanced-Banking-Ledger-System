import { useEffect, useState } from 'react'
import { Copy, PlusCircle, Send, Wallet, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { useLedger } from '../context/LedgerContext'
import { useActions } from '../context/ActionsContext'
import { api } from '../api/client'
import { formatCurrency, formatDate } from '../lib/format'

const STATUS_TONE = { ACTIVE: 'emerald', FROZEN: 'gold', CLOSED: 'rose' }

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          toast.success('Account ID copied')
          setTimeout(() => setCopied(false), 1500)
        } catch {
          toast.error('Could not copy to clipboard')
        }
      }}
      className="rounded-lg p-1.5 text-mist-500 transition hover:bg-white/[0.06] hover:text-white"
      aria-label="Copy account ID"
    >
      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
    </button>
  )
}

export default function Accounts() {
  const { accounts, loading } = useLedger()
  const { openTransfer, openCreateAccount } = useActions()
  const [balances, setBalances] = useState({})

  useEffect(() => {
    let cancelled = false
    accounts.forEach((acc) => {
      setBalances((prev) => (acc._id in prev ? prev : { ...prev, [acc._id]: { status: 'loading' } }))
      api
        .accountBalance(acc._id)
        .then((data) => {
          if (!cancelled) setBalances((prev) => ({ ...prev, [acc._id]: { status: 'ready', value: data.balance } }))
        })
        .catch(() => {
          if (!cancelled) setBalances((prev) => ({ ...prev, [acc._id]: { status: 'error' } }))
        })
    })
    return () => {
      cancelled = true
    }
  }, [accounts])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mist-500">All ledger accounts registered to your profile.</p>
        <button onClick={openCreateAccount} className="btn-primary">
          <PlusCircle size={16} />
          New account
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-40 w-full" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="glass-panel">
          <EmptyState icon={Wallet} title="No accounts yet" subtitle="Create your first account to start transacting." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((acc) => {
            const balance = balances[acc._id]
            return (
              <div key={acc._id} className="glass-panel flex flex-col p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 ring-1 ring-inset ring-gold-500/25">
                    <Wallet size={17} />
                  </span>
                  <Badge tone={STATUS_TONE[acc.status] || 'slate'}>{acc.status}</Badge>
                </div>

                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-mist-500">Balance</p>
                {balance?.status === 'loading' || !balance ? (
                  <div className="skeleton mt-1.5 h-8 w-28" />
                ) : balance.status === 'error' ? (
                  <p className="mt-1.5 text-sm text-rose-400">Unavailable</p>
                ) : (
                  <p className="mt-1.5 font-display text-2xl font-semibold text-white">{formatCurrency(balance.value, acc.currency)}</p>
                )}

                <div className="mt-4 flex items-center justify-between rounded-lg border border-white/[0.06] bg-ink-900/60 px-2.5 py-2">
                  <p className="truncate font-mono text-[11px] text-mist-400">{acc._id}</p>
                  <CopyButton value={acc._id} />
                </div>

                <p className="mt-3 text-[11px] text-mist-500">Opened {formatDate(acc.createdAt)}</p>

                <button
                  onClick={() => openTransfer(acc._id)}
                  disabled={acc.status !== 'ACTIVE'}
                  className="btn-secondary mt-4 w-full disabled:opacity-40"
                >
                  <Send size={14} />
                  Transfer here
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
