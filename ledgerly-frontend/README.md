# Ledgerly frontend

A responsive vanilla JavaScript dashboard for the Ledgerly banking API.

## Run locally

1. Start the API on `http://localhost:3000`.
2. In this directory, install dependencies: `npm install`.
3. Build production CSS with `npm run build`, then serve it with `npm start` at `http://localhost:4173`.

For development, use `npm run dev` to watch Tailwind CSS and run the static server together.

## API configuration

`src/js/api.js` contains the single `API_BASE_URL` constant. The client sends every request with `credentials: 'include'`, so the API must allow credentialed CORS when hosted on another origin. Authentication is cookie-based; no tokens are stored in browser storage.

The UI implements the API contract in the project brief (`/api/transactions/balance`, `/history`, `/deposit`, `/withdraw`, and `/transfer`). Each money submission calls `crypto.randomUUID()` through `newIdempotencyKey()` to generate an idempotency key.
