import { useMemo, useState } from 'react'
import { History, Search, ArrowDownToLine, ArrowUpFromLine, Send } from 'lucide-react'
import TransactionRow from '../components/TransactionRow'
import EmptyState from '../components/ui/EmptyState'
import { useLedger } from '../context/LedgerContext'
import { formatCurrency } from '../lib/format'

const TYPE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'deposit', label: 'Deposits', icon: ArrowDownToLine },
  { key: 'withdraw', label: 'Withdrawals', icon: ArrowUpFromLine },
  { key: 'transfer', label: 'Transfers', icon: Send }
]

export default function Transactions() {
  const { transactions, loading } = useLedger()
  const [typeFilter, setTypeFilter] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (query.trim() && !String(t.id).toLowerCase().includes(query.trim().toLowerCase())) return false
      return true
    })
  }, [transactions, typeFilter, query])

  const totals = useMemo(() => {
    const credit = transactions.filter((t) => t.direction === 'credit').reduce((s, t) => s + Number(t.amount || 0), 0)
    const debit = transactions.filter((t) => t.direction === 'debit').reduce((s, t) => s + Number(t.amount || 0), 0)
    return { credit, debit }
  }, [transactions])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-panel p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-mist-500">Total credited</p>
          <p className="mt-1.5 font-display text-xl font-semibold text-emerald-400">{formatCurrency(totals.credit)}</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-mist-500">Total debited</p>
          <p className="mt-1.5 font-display text-xl font-semibold text-white">{formatCurrency(totals.debit)}</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-mist-500">Total transactions</p>
          <p className="mt-1.5 font-display text-xl font-semibold text-white">{transactions.length}</p>
        </div>
      </div>

      <div className="glass-panel p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  typeFilter === key
                    ? 'bg-gold-500/15 text-gold-400 ring-1 ring-inset ring-gold-500/25'
                    : 'text-mist-400 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {Icon && <Icon size={13} />}
                {label}
              </button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by transaction ID"
              className="field-input pl-8 text-xs"
            />
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3 py-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-14 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={History}
              title="No matching transactions"
              subtitle={transactions.length === 0 ? 'Your activity will appear here once you transact.' : 'Try a different filter or search term.'}
            />
          ) : (
            <div>
              {filtered.map((t) => (
                <TransactionRow key={t.id} transaction={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
