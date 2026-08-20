import { ArrowDownToLine, ArrowUpFromLine, Send } from 'lucide-react'
import Badge from './ui/Badge'
import { formatCurrency, formatDate, formatRelative, shortId } from '../lib/format'

const TYPE_META = {
  deposit: { icon: ArrowDownToLine, label: 'Deposit' },
  withdraw: { icon: ArrowUpFromLine, label: 'Withdrawal' },
  transfer: { icon: Send, label: 'Transfer' }
}

const STATUS_TONE = { COMPLETED: 'emerald', PENDING: 'gold', FAILED: 'rose' }

export default function TransactionRow({ transaction, relative = false }) {
  const meta = TYPE_META[transaction.type] || TYPE_META.transfer
  const Icon = meta.icon
  const isCredit = transaction.direction === 'credit'

  return (
    <div className="flex items-center gap-4 border-b border-white/[0.05] px-1 py-3.5 last:border-0 sm:px-2">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${
          isCredit ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/25' : 'bg-rose-500/10 text-rose-400 ring-rose-500/25'
        }`}
      >
        <Icon size={16} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-white">{meta.label}</p>
          <Badge tone={STATUS_TONE[transaction.status] || 'slate'}>{transaction.status || 'COMPLETED'}</Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-mist-500">
          {relative ? formatRelative(transaction.createdAt) : formatDate(transaction.createdAt)} · {shortId(transaction.id)}
        </p>
      </div>

      <p className={`shrink-0 text-right font-display text-sm font-semibold sm:text-base ${isCredit ? 'text-emerald-400' : 'text-white'}`}>
        {isCredit ? '+' : '−'}
        {formatCurrency(transaction.amount)}
      </p>
    </div>
  )
}
