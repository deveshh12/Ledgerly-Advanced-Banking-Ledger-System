import { api } from './api.js';
import { formatCurrency, formatDate, newIdempotencyKey, normalizeTransactions, redirectOnUnauthorized, toast } from './utils.js';

const balanceNode = document.querySelector('[data-balance]');
const recentNode = document.querySelector('[data-recent]');
const modal = document.querySelector('[data-modal]');
const form = document.querySelector('[data-transaction-form]');
const accountDetails = document.createElement('div');
accountDetails.className = 'mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-300';
accountDetails.innerHTML = '<span>Account ID:</span><code data-account-id class="max-w-full truncate rounded bg-white/10 px-2 py-1 text-xs">Loading…</code><button data-copy-account class="rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold transition hover:bg-white/20" type="button">Copy</button>';
balanceNode.insertAdjacentElement('afterend', accountDetails);
const accountIdNode = accountDetails.querySelector('[data-account-id]');
let action = 'deposit';

function transactionType(item) { return String(item.type || item.transactionType || 'transfer').toLowerCase(); }
function amount(item) { return item.amount ?? item.value ?? 0; }
function renderRecent(items) {
  if (!items.length) { recentNode.innerHTML = '<div class="p-10 text-center"><p class="text-lg font-medium">No transactions yet</p><p class="mt-2 text-sm text-slate-500">Use a quick action above to make your first move.</p></div>'; return; }
  recentNode.innerHTML = items.slice(0, 7).map(item => { const type = transactionType(item); const outgoing = item.direction === 'debit' || /withdraw|debit/.test(type); return `<div class="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"><div class="flex min-w-0 items-center gap-3"><span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl ${outgoing ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}">${outgoing ? '↑' : '↓'}</span><div class="min-w-0"><p class="truncate text-sm font-semibold capitalize">${type}</p><p class="mt-0.5 text-xs text-slate-500">${formatDate(item.createdAt || item.date)}</p></div></div><p class="whitespace-nowrap text-sm font-semibold ${outgoing ? 'text-rose-600' : 'text-emerald-600'}">${outgoing ? '−' : '+'}${formatCurrency(amount(item))}</p></div>`; }).join('');
}
async function load() {
  try { const [balance, history] = await Promise.all([api.balance(), api.history()]); balanceNode.textContent = formatCurrency(balance.balance ?? balance.currentBalance ?? balance.amount); accountIdNode.textContent = balance.accountId || 'Unavailable'; renderRecent(normalizeTransactions(history)); }
  catch (error) { redirectOnUnauthorized(error); balanceNode.textContent = 'Unable to load'; recentNode.innerHTML = `<div class="p-8 text-sm text-rose-700">${error.message}</div>`; }
}
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => { action = button.dataset.action; document.querySelector('[data-modal-title]').textContent = action[0].toUpperCase() + action.slice(1) + ' funds'; document.querySelector('[data-recipient]').classList.toggle('hidden', action !== 'transfer'); form.reset(); modal.classList.replace('hidden', 'flex'); document.querySelector('#amount').focus(); }));
document.querySelector('[data-close-modal]').addEventListener('click', () => modal.classList.replace('flex', 'hidden'));
modal.addEventListener('click', event => { if (event.target === modal) modal.classList.replace('flex', 'hidden'); });
form.addEventListener('submit', async event => { event.preventDefault(); const data = Object.fromEntries(new FormData(form)); const errorNode = document.querySelector('[data-transaction-error]'); const button = form.querySelector('button'); errorNode.classList.add('hidden'); if (!(Number(data.amount) > 0)) { errorNode.textContent = 'Enter an amount greater than zero.'; return errorNode.classList.remove('hidden'); } if (action === 'transfer' && !data.toAccountId.trim()) { errorNode.textContent = 'Enter the recipient account ID.'; return errorNode.classList.remove('hidden'); } button.disabled = true; button.textContent = 'Processing…'; try { await api[action]({ amount: Number(data.amount), ...(action === 'transfer' ? { toAccountId: data.toAccountId.trim() } : {}), idempotencyKey: newIdempotencyKey() }); modal.classList.replace('flex', 'hidden'); toast(`${action[0].toUpperCase() + action.slice(1)} completed.`); load(); } catch (error) { redirectOnUnauthorized(error); errorNode.textContent = error.message; errorNode.classList.remove('hidden'); } finally { button.disabled = false; button.textContent = 'Continue'; } });
document.querySelector('[data-logout]').addEventListener('click', async () => { try { await api.logout(); } finally { window.location.assign('/login.html'); } });
accountDetails.querySelector('[data-copy-account]').addEventListener('click', async (event) => {
  const accountId = accountIdNode.textContent;
  if (!accountId || accountId === 'Unavailable' || accountId === 'Loading…') return;
  try {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(accountId); copied = true; } catch { /* fall back below */ }
    }
    if (!copied) {
      const fallback = document.createElement('textarea');
      fallback.value = accountId;
      fallback.setAttribute('readonly', '');
      fallback.style.position = 'fixed';
      fallback.style.opacity = '0';
      document.body.append(fallback);
      fallback.select();
      copied = document.execCommand('copy');
      fallback.remove();
      if (!copied) throw new Error('Copy command was blocked');
    }
    event.currentTarget.textContent = 'Copied';
    toast('Account ID copied. Share it only with someone sending you money.');
    setTimeout(() => { event.currentTarget.textContent = 'Copy'; }, 1800);
  } catch {
    toast('Select and copy the Account ID manually.', 'error');
  }
});
load();
