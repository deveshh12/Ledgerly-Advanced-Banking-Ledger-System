export const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value || 0));
export const formatDate = (value) => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
// Every submission deliberately receives a fresh UUID v4 for backend idempotency.
export const newIdempotencyKey = () => crypto.randomUUID();
export const normalizeTransactions = (data) => Array.isArray(data) ? data : (data.transactions || data.history || []);
export function toast(message, type = 'success') {
  const node = document.createElement('div');
  node.className = `fixed right-4 top-4 z-50 max-w-sm rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg fade-in ${type === 'error' ? 'bg-rose-600' : 'bg-ink'}`;
  node.textContent = message; document.body.append(node); setTimeout(() => node.remove(), 4500);
}
export function redirectOnUnauthorized(error) { if (error.status === 401) window.location.replace('/login.html'); }
