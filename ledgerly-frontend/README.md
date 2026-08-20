# Ledgerly frontend

A premium React + Vite + Tailwind dashboard for the Ledgerly banking ledger API. Covers the full backend surface: authentication, multi-account management, deposits, withdrawals, transfers, and transaction history.

## Stack

- React 18 + React Router 6 (SPA, client-side routing)
- Tailwind CSS (custom dark/gold "private banking" theme)
- Framer Motion (page and modal transitions)
- react-hot-toast (notifications)
- lucide-react (icons)
- Vite (dev server + build)

## Run locally

1. Start the API — from the repo root, `npm install && npm run dev` (listens on `http://localhost:3000`).
2. In this directory: `npm install`.
3. `npm run dev` starts the Vite dev server at `http://localhost:4173`.

Vite loads `.env.development` in dev and `.env.production` when you run `npm run build`. Both just set `VITE_API_BASE_URL` — no secrets involved. The backend's `FRONTEND_ORIGIN` must match whatever origin serves this app, since auth uses an HTTP-only cookie sent with `credentials: 'include'`.

## Production build

```bash
npm run build      # outputs to dist/
npm start           # serves the build with `vite preview` on port 4173
```

## Structure

- `src/api/client.js` — typed fetch wrapper covering every backend route (`auth`, `accounts`, `transactions`).
- `src/context/AuthContext.jsx` — session state; since the API has no `/me` endpoint, it caches the last-known user profile locally and verifies the session cookie on load.
- `src/context/LedgerContext.jsx` — shared accounts/balance/history state for the authenticated app shell.
- `src/context/ActionsContext.jsx` + `src/components/MoneyActionModal.jsx` — the single modal that drives deposit, withdraw, transfer, and account creation, wired to idempotency keys via `crypto.randomUUID()`.
- `src/pages/` — Login, Register, Dashboard, Accounts, Transactions.

## Notes on backend behavior reflected in the UI

- Deposits and withdrawals always apply to your **primary active account** (the first `ACTIVE` account found for your user) — the backend doesn't support choosing a target for these, so the UI labels them accordingly.
- Transfers can target any active account ID, including your own other accounts (quick-pick chips) or one pasted in manually.
- `GET /api/transactions/history` is scoped to the primary account's ledger entries; per-account balances elsewhere (e.g. the Accounts page) come from `GET /api/accounts/balance/:accountId`.
