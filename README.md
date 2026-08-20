# Ledgerly — Advanced Banking Ledger System

Ledgerly is a cookie-authenticated banking ledger with an Express/MongoDB API and a premium React + Tailwind dashboard. Balances are derived from immutable ledger entries rather than stored as mutable values.

## Features

- HTTP-only JWT cookie authentication and bcrypt password hashing
- Multi-account management: create accounts, list them, and check per-account balances
- Deposit, withdrawal, and transfer flows with idempotency UUIDs to prevent duplicate money movements
- Complete balance and transaction-history endpoints
- Premium React dashboard covering the full API surface — accounts, transfers, and filterable transaction history

## Project structure

```text
.
├── src/                  # Express API, MongoDB models, routes, controllers
├── ledgerly-frontend/    # React + Vite + Tailwind dashboard
├── .env.example          # Backend environment template
└── server.js             # Backend entry point
```

## Prerequisites

- Node.js 18+
- MongoDB Community Server or MongoDB Atlas

## Run locally

1. Copy `.env.example` to `.env`, then set `MONGO_URI` and `JWT_SECRET`.
2. Install and run the API:

   ```bash
   npm install
   npm run dev
   ```

   The API listens on `http://localhost:3000`.

3. In a separate terminal, run the frontend:

   ```bash
   cd ledgerly-frontend
   npm install
   npm run dev
   ```

4. Visit `http://localhost:4173`.

For a production build, run `npm run build` in `ledgerly-frontend` (outputs to `dist/`), then `npm start` to preview it.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB/Atlas connection string |
| `JWT_SECRET` | Yes | Long random secret for signed cookies |
| `FRONTEND_ORIGIN` | No | Browser origin; defaults to `http://localhost:4173` |
| `PORT` | No | API port; defaults to `3000` |
| `EMAIL_USER`, `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN` | No | Gmail OAuth2 notifications |

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register user and create INR account |
| POST | `/api/auth/login` | Start session |
| POST | `/api/auth/logout` | End session |
| POST | `/api/accounts/` | Create an additional account |
| GET | `/api/accounts/` | List the logged-in user's accounts |
| GET | `/api/accounts/balance/:accountId` | Balance for a specific account |
| GET | `/api/transactions/balance` | Derived balance for the primary account |
| GET | `/api/transactions/history` | Ledger history for the primary account |
| POST | `/api/transactions/deposit` | Credit the primary account |
| POST | `/api/transactions/withdraw` | Debit the primary account |
| POST | `/api/transactions/transfer` | Transfer to any active recipient account ID |

Money requests include a fresh client-generated UUID v4 `idempotencyKey`. Never commit `.env`; use `.env.example` as the configuration template.
