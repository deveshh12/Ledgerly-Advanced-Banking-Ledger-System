import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'

const LedgerContext = createContext(null)

export function LedgerProvider({ children }) {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [primaryBalance, setPrimaryBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshAccounts = useCallback(async () => {
    const data = await api.listAccounts()
    setAccounts(data.accounts || [])
    return data.accounts || []
  }, [])

  const refreshTransactions = useCallback(async () => {
    const data = await api.history()
    setTransactions(data.transactions || [])
    return data.transactions || []
  }, [])

  const refreshBalance = useCallback(async () => {
    try {
      const data = await api.balance()
      setPrimaryBalance(data.balance)
      return data
    } catch (err) {
      if (err.status === 404) {
        setPrimaryBalance(null)
        return null
      }
      throw err
    }
  }, [])

  const refreshAll = useCallback(async () => {
    setError('')
    try {
      await Promise.all([refreshAccounts(), refreshTransactions(), refreshBalance()])
    } catch (err) {
      setError(err.message || 'Could not load your ledger data.')
    }
  }, [refreshAccounts, refreshTransactions, refreshBalance])

  useEffect(() => {
    setLoading(true)
    refreshAll().finally(() => setLoading(false))
  }, [refreshAll])

  const activeAccounts = useMemo(() => accounts.filter((a) => a.status === 'ACTIVE'), [accounts])
  const netWorth = useMemo(() => {
    if (primaryBalance == null) return null
    return primaryBalance
  }, [primaryBalance])

  const value = useMemo(
    () => ({
      accounts,
      activeAccounts,
      transactions,
      primaryBalance,
      netWorth,
      loading,
      error,
      refreshAccounts,
      refreshTransactions,
      refreshBalance,
      refreshAll
    }),
    [accounts, activeAccounts, transactions, primaryBalance, netWorth, loading, error, refreshAccounts, refreshTransactions, refreshBalance, refreshAll]
  )

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>
}

export function useLedger() {
  const ctx = useContext(LedgerContext)
  if (!ctx) throw new Error('useLedger must be used within LedgerProvider')
  return ctx
}
