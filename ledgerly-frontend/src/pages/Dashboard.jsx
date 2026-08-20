import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownToLine, ArrowUpFromLine, Send, PlusCircle, Wallet, TrendingUp, Clock, History as HistoryIcon, ArrowRight } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import TransactionRow from '../components/TransactionRow'
import EmptyState from '../components/ui/EmptyState'
import Badge from '../components/ui/Badge'
import { useLedger } from '../context/LedgerContext'
import { useAuth } from '../context/AuthContext'
import { useActions } from '../context/ActionsContext'
import { formatCurrency, formatRelative, shortId } from '../lib/format'

const QUICK_ACTIONS = [
  { key: 'deposit', label: 'Deposit', icon: ArrowDownToLine },
  { key: 'withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
  { key: 'transfer', label: 'Transfer', icon: Send },
  { key: 'create-account', label: 'New account', icon: PlusCircle }
]

export default function Dashboard() {
  const { user } = useAuth()
  const { accounts, activeAccounts, transactions, primaryBalance, loading, error } = useLedger()
  const { openDeposit, openWithdraw, openTransfer, openCreateAccount } = useActions()

  const actionMap = {
    deposit: openDeposit,
    withdraw: openWithdraw,
    transfer: () => openTransfer(''),
    'create-account': openCreateAccount
  }

  const monthVolume = useMemo(() => {
    const now = new Date()
    return transactions
      .filter((t) => {
        const d = new Date(t.createdAt)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  }, [transactions])

  const lastActivity = transactions[0]?.createdAt

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-mist-500">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}. Here's where things stand.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Primary balance"
          value={primaryBalance != null ? formatCurrency(primaryBalance) : '—'}
          icon={Wallet}
          tone="gold"
          hint="Derived from ledger entries"
          loading={loading}
        />
        <StatCard
          label="Active accounts"
          value={`${activeAccounts.length} / ${accounts.length}`}
          icon={TrendingUp}
          tone="emerald"
          hint="Active vs. total accounts"
          loading={loading}
        />
        <StatCard
          label="This month's volume"
          value={formatCurrency(monthVolume)}
          icon={HistoryIcon}
          tone="slate"
          hint={`${transactions.filter((t) => new Date(t.createdAt).getMonth() === new Date().getMonth()).length} transactions`}
          loading={loading}
        />
        <StatCard
          label="Last activity"
          value={lastActivity ? formatRelative(lastActivity) : 'No activity yet'}
          icon={Clock}
          tone="gold"
          hint={lastActivity ? shortId(transactions[0]?.id) : 'Make your first move'}
          loading={loading}
        />
      </div>

      <div className="glass-panel p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-mist-500">Quick actions</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_ACTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={actionMap[key]}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-5 transition hover:border-gold-500/30 hover:bg-gold-500/[0.06]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-gold-400 ring-1 ring-inset ring-white/10 transition group-hover:bg-gold-500/15">
                <Icon size={18} />
              </span>
              <span className="text-sm font-medium text-mist-300 group-hover:text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="glass-panel p-5 lg:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Recent transactions</p>
            <Link to="/transactions" className="flex items-center gap-1 text-xs font-semibold text-gold-400 hover:text-gold-500">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3 py-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-14 w-full" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState
              icon={HistoryIcon}
              title="No transactions yet"
              subtitle="Deposit funds or transfer between accounts to see activity here."
              action={
                <button onClick={openDeposit} className="btn-secondary mt-2">
                  Make your first deposit
                </button>
              }
            />
          ) : (
            <div>
              {transactions.slice(0, 6).map((t) => (
                <TransactionRow key={t.id} transaction={t} relative />
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Your accounts</p>
            <Link to="/accounts" className="flex items-center gap-1 text-xs font-semibold text-gold-400 hover:text-gold-500">
              Manage <ArrowRight size={13} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3 py-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-14 w-full" />
              ))}
            </div>
          ) : accounts.length === 0 ? (
            <EmptyState icon={Wallet} title="No accounts found" subtitle="Something went wrong provisioning your account." />
          ) : (
            <div className="space-y-2.5">
              {accounts.slice(0, 5).map((acc) => (
                <div key={acc._id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-mist-300">{shortId(acc._id)}</p>
                    <p className="mt-0.5 text-[11px] text-mist-500">{acc.currency} account</p>
                  </div>
                  <Badge tone={acc.status === 'ACTIVE' ? 'emerald' : acc.status === 'FROZEN' ? 'gold' : 'rose'}>{acc.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
