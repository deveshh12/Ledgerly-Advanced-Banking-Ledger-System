import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)
const STORAGE_KEY = 'ledgerly.user'

function readCachedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCachedUser(user) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else localStorage.removeItem(STORAGE_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readCachedUser())
  const [status, setStatus] = useState('checking') // checking | authenticated | unauthenticated

  useEffect(() => {
    let cancelled = false
    api
      .listAccounts()
      .then(() => {
        if (cancelled) return
        setStatus('authenticated')
        setUser((current) => current || { name: 'Account holder', email: '' })
      })
      .catch(() => {
        if (cancelled) return
        writeCachedUser(null)
        setUser(null)
        setStatus('unauthenticated')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const applySession = useCallback((nextUser) => {
    writeCachedUser(nextUser)
    setUser(nextUser)
    setStatus('authenticated')
  }, [])

  const login = useCallback(
    async (credentials) => {
      const data = await api.login(credentials)
      applySession(data.user)
      return data.user
    },
    [applySession]
  )

  const register = useCallback(
    async (details) => {
      const data = await api.register(details)
      applySession(data.user)
      return data.user
    },
    [applySession]
  )

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      writeCachedUser(null)
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  const value = useMemo(
    () => ({ user, status, isAuthenticated: status === 'authenticated', login, register, logout }),
    [user, status, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
