// Change this one constant when deploying to a separately hosted API.
export const API_BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong. Please try again.');
      error.status = response.status;
      throw error;
    }
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error('Unable to reach Ledgerly. Please check your connection and try again.');
    throw error;
  }
}

export const api = {
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  balance: () => request('/api/transactions/balance'),
  history: () => request('/api/transactions/history'),
  deposit: (body) => request('/api/transactions/deposit', { method: 'POST', body: JSON.stringify(body) }),
  withdraw: (body) => request('/api/transactions/withdraw', { method: 'POST', body: JSON.stringify(body) }),
  transfer: (body) => request('/api/transactions/transfer', { method: 'POST', body: JSON.stringify(body) })
};
