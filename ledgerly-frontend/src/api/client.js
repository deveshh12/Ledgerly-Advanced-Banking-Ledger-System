export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    })
  } catch {
    throw new ApiError('Unable to reach Ledgerly. Check your connection and try again.', 0)
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(data.message || 'Something went wrong. Please try again.', response.status)
  }

  return data
}

const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) })
const get = (path) => request(path)

export const api = {
  register: (body) => post('/api/auth/register', body),
  login: (body) => post('/api/auth/login', body),
  logout: () => post('/api/auth/logout'),

  listAccounts: () => get('/api/accounts/'),
  createAccount: () => post('/api/accounts/'),
  accountBalance: (accountId) => get(`/api/accounts/balance/${accountId}`),

  balance: () => get('/api/transactions/balance'),
  history: () => get('/api/transactions/history'),
  deposit: (body) => post('/api/transactions/deposit', body),
  withdraw: (body) => post('/api/transactions/withdraw', body),
  transfer: (body) => post('/api/transactions/transfer', body)
}

export { ApiError }
