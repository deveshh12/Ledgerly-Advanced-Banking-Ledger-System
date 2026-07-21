# Ledgerly — Advanced Banking Ledger System

Ledgerly is a cookie-authenticated banking ledger with an Express/MongoDB API and a responsive vanilla JavaScript + Tailwind dashboard. Balances are derived from immutable ledger entries rather than stored as mutable values.

## Features

- HTTP-only JWT cookie authentication and bcrypt password hashing
- Account creation during registration, deposit, withdrawal, and transfers
- Idempotency UUIDs to prevent duplicate money movements
- Complete balance and transaction-history endpoints
- Responsive Ledgerly frontend with account-ID copying and transfer flow

## Project structure

```text
.
├── src/                  # Express API, MongoDB models, routes, controllers
├── ledgerly-frontend/    # Static Express server and Tailwind frontend
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

For production CSS, run `npm run build` in `ledgerly-frontend` before `npm start`.

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
| GET | `/api/transactions/balance` | Derived account balance |
| GET | `/api/transactions/history` | Ledger history |
| POST | `/api/transactions/deposit` | Credit logged-in account |
| POST | `/api/transactions/withdraw` | Debit logged-in account |
| POST | `/api/transactions/transfer` | Transfer to recipient account ID |

Money requests include a fresh client-generated UUID v4 `idempotencyKey`. Never commit `.env`; use `.env.example` as the configuration template.
