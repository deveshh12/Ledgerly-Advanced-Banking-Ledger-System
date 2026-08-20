import { useEffect, useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, PlusCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from './ui/Modal'
import Field from './ui/Field'
import Spinner from './ui/Spinner'
import { useActions } from '../context/ActionsContext'
import { useLedger } from '../context/LedgerContext'
import { api, ApiError } from '../api/client'
import { formatCurrency, newIdempotencyKey } from '../lib/format'

const COPY = {
  deposit: {
    title: 'Deposit funds',
    subtitle: 'Credit your primary active account.',
    icon: ArrowDownToLine,
    cta: 'Confirm deposit'
  },
  withdraw: {
    title: 'Withdraw funds',
    subtitle: 'Debit your primary active account.',
    icon: ArrowUpFromLine,
    cta: 'Confirm withdrawal'
  },
  transfer: {
    title: 'Transfer funds',
    subtitle: 'Send money to another active account.',
    icon: Send,
    cta: 'Send transfer'
  },
  'create-account': {
    title: 'Open a new account',
    subtitle: 'Create another INR ledger account under your profile.',
    icon: PlusCircle,
    cta: 'Create account'
  }
}

export default function MoneyActionModal() {
  const { open, mode, presetToAccountId, close } = useActions()
  const { activeAccounts, primaryBalance, refreshAll } = useLedger()
  const [amount, setAmount] = useState('')
  const [toAccountId, setToAccountId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey())

  useEffect(() => {
    if (open) {
      setAmount('')
      setToAccountId(presetToAccountId || '')
      setError('')
      setIdempotencyKey(newIdempotencyKey())
    }
  }, [open, mode, presetToAccountId])

  const copy = mode ? COPY[mode] : null
  const Icon = copy?.icon

  const otherAccounts = useMemo(
    () => activeAccounts.filter((a) => !presetToAccountId || a._id !== presetToAccountId),
    [activeAccounts, presetToAccountId]
  )

  if (!copy) return null

  const numericAmount = Number(amount)
  const amountValid = Number.isFinite(numericAmount) && numericAmount > 0

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (mode === 'create-account') {
      setSubmitting(true)
      try {
        await api.createAccount()
        toast.success('New account created')
        await refreshAll()
        close()
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Could not create the account.')
      } finally {
        setSubmitting(false)
      }
      return
    }

    if (!amountValid) {
      setError('Enter an amount greater than zero.')
      return
    }
    if (mode === 'transfer' && !toAccountId.trim()) {
      setError('Enter or choose a recipient account ID.')
      return
    }
    if (mode === 'withdraw' && primaryBalance != null && numericAmount > primaryBalance) {
      setError('That exceeds your available balance.')
      return
    }

    setSubmitting(true)
    try {
      const body = { amount: numericAmount, idempotencyKey }
      if (mode === 'deposit') await api.deposit(body)
      else if (mode === 'withdraw') await api.withdraw(body)
      else if (mode === 'transfer') await api.transfer({ ...body, toAccountId: toAccountId.trim() })

      toast.success(`${copy.title} completed`)
      await refreshAll()
      close()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={submitting ? undefined : close} title={undefined}>
      <div className="mb-1 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 ring-1 ring-inset ring-gold-500/25">
          <Icon size={18} />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-white">{copy.title}</h2>
          <p className="text-sm text-mist-500">{copy.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {mode !== 'create-account' && (
          <Field label="Amount (INR)">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-mist-500">₹</span>
              <input
                autoFocus
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="field-input pl-7"
              />
            </div>
            {mode === 'withdraw' && primaryBalance != null && (
              <p className="mt-1.5 text-xs text-mist-500">Available: {formatCurrency(primaryBalance)}</p>
            )}
          </Field>
        )}

        {mode === 'transfer' && (
          <Field label="Recipient account ID" hint="Paste any active account ID, or pick one of yours below.">
            <input
              type="text"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              placeholder="e.g. 6620f9b1a2c3d4e5f6a7b8c9"
              className="field-input font-mono text-xs tracking-tight"
            />
            {otherAccounts.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {otherAccounts.map((acc) => (
                  <button
                    type="button"
                    key={acc._id}
                    onClick={() => setToAccountId(acc._id)}
                    className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition ${
                      toAccountId === acc._id
                        ? 'border-gold-500/50 bg-gold-500/10 text-gold-400'
                        : 'border-white/10 text-mist-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {acc._id.slice(-8)}
                  </button>
                ))}
              </div>
            )}
          </Field>
        )}

        {mode === 'create-account' && (
          <p className="rounded-xl border border-white/[0.06] bg-ink-900/60 px-4 py-3 text-sm text-mist-400">
            A new account starts with a zero balance in INR and can immediately receive deposits and transfers.
          </p>
        )}

        {error && <p className="text-sm font-medium text-rose-400">{error}</p>}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button type="button" className="btn-ghost" onClick={close} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary min-w-[9rem]" disabled={submitting}>
            {submitting ? <Spinner className="h-4 w-4 text-ink-950" /> : copy.cta}
          </button>
        </div>
      </form>
    </Modal>
  )
}
