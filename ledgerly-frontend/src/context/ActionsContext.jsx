import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ActionsContext = createContext(null)

export function ActionsProvider({ children }) {
  const [state, setState] = useState({ open: false, mode: null, presetToAccountId: '' })

  const openAction = useCallback((mode, presetToAccountId = '') => {
    setState({ open: true, mode, presetToAccountId })
  }, [])

  const close = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  const value = useMemo(
    () => ({
      ...state,
      openDeposit: () => openAction('deposit'),
      openWithdraw: () => openAction('withdraw'),
      openTransfer: (toId) => openAction('transfer', toId),
      openCreateAccount: () => openAction('create-account'),
      close
    }),
    [state, openAction, close]
  )

  return <ActionsContext.Provider value={value}>{children}</ActionsContext.Provider>
}

export function useActions() {
  const ctx = useContext(ActionsContext)
  if (!ctx) throw new Error('useActions must be used within ActionsProvider')
  return ctx
}
