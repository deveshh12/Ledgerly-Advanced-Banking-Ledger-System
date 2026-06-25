# 🏦 Advanced Banking Ledger System

A production-ready backend banking infrastructure built with **Node.js**, **Express**, and **MongoDB** that simulates real-world financial transaction processing with robust auditing, security, and reliability guarantees.

---

## 📌 Overview

This project implements a **ledger-based architecture** for financial systems — the same principle used by real banks. Instead of storing a mutable "balance" field, every transaction is recorded as an immutable ledger entry, and the current balance is always derived by aggregating transaction history. This ensures full auditability and eliminates data inconsistency issues.

---

## ✨ Features

- **Ledger-Based Balance Calculation** — Balances are computed dynamically from transaction history rather than stored as a hardcoded value, ensuring complete auditability and data integrity.
- **Idempotency Validation** — Duplicate transaction detection prevents the same financial operation from being processed more than once, critical for reliability in distributed or retry-prone environments.
- **JWT Authentication** — Stateless, secure authentication using signed JSON Web Tokens with cookie-based delivery.
- **Password Hashing** — User passwords are hashed using `bcryptjs` before storage — plain-text passwords are never persisted.
- **Email Notifications** — Automated transactional and registration emails via Nodemailer integrated with Gmail SMTP.
- **Environment-Based Configuration** — All secrets and environment-specific values are managed via `dotenv`, keeping credentials out of source code.
- **Production Deployment** — Hosted on [Render](https://render.com) with a live endpoint.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB (via Mongoose) |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password Security | `bcryptjs` |
| Email | Nodemailer (Gmail SMTP) |
| Config Management | `dotenv` |
| Cookie Handling | `cookie-parser` |
| API Testing | Postman |
| Deployment | Render |

---

## 🗂️ Project Structure

```
Backend-Ledger-System/
├── server.js           # App entry point — initializes Express and DB connection
├── src/
│   ├── config/         # Database connection and environment setup
│   ├── models/         # Mongoose schemas (User, Transaction/Ledger)
│   ├── routes/         # API route definitions
│   ├── controllers/    # Business logic handlers
│   ├── middleware/     # JWT auth middleware, error handling
│   └── utils/          # Email helpers, idempotency checks
├── .gitignore
├── package.json
└── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A Gmail account for SMTP email delivery

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/deveshh12/Backend-Ledger-System.git
cd Backend-Ledger-System

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# 4. Start the development server
npm run dev
```

The server will start at `http://localhost:3000` by default.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following keys:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ledger
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Gmail SMTP for Nodemailer
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Note:** For Gmail, generate an [App Password](https://myaccount.google.com/apppasswords) rather than using your main account password.

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (sends welcome email) |
| `POST` | `/api/auth/login` | Login and receive JWT cookie |
| `POST` | `/api/auth/logout` | Clear auth cookie |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/transactions/deposit` | Credit amount to account |
| `POST` | `/api/transactions/withdraw` | Debit amount from account |
| `POST` | `/api/transactions/transfer` | Transfer between accounts |
| `GET` | `/api/transactions/history` | Retrieve full transaction ledger |
| `GET` | `/api/transactions/balance` | Get current balance (computed from ledger) |

> All transaction endpoints require a valid JWT (sent via `Authorization` header or cookie).

---

## 🏗️ Architecture Highlights

### Ledger Pattern
Every financial operation creates a new, immutable `Transaction` document in MongoDB. The user's balance is never stored directly — it is always computed as:

```
balance = SUM(credit transactions) - SUM(debit transactions)
```

This mirrors how real financial systems work and makes every rupee traceable.

### Idempotency
Each transaction request can carry a unique `idempotencyKey`. If the same key is submitted again (e.g., due to a network retry), the server detects it and returns the original result instead of processing a duplicate — preventing double-charges or double-credits.

### JWT + Cookie Auth
On login, a signed JWT is issued and stored in an `HttpOnly` cookie, protecting it from JavaScript-based XSS attacks. The `cookie-parser` middleware reads it on each subsequent request.

---

## 📧 Email Notifications

Nodemailer is configured with Gmail SMTP to send:

- **Registration confirmation** — sent when a new user signs up
- **Transaction receipts** — sent after every successful deposit, withdrawal, or transfer

---

## 🧪 Testing with Postman

A Postman collection is recommended for testing all endpoints. Import and set the base URL to your local or Render deployment URL.

Steps:
1. `POST /api/auth/register` → creates account + receives welcome email
2. `POST /api/auth/login` → JWT cookie set automatically
3. `POST /api/transactions/deposit` → add funds
4. `GET /api/transactions/balance` → confirm balance reflects deposit
5. `GET /api/transactions/history` → view full ledger audit trail

---

## ☁️ Deployment

The service is deployed on **Render** (Platform-as-a-Service).

- Render reads environment variables from its dashboard (no `.env` file needed in production)
- The start command is `node server.js`
- MongoDB is hosted on **MongoDB Atlas** (free tier compatible)

---

## 📄 License

This project is open source and available under the [ISC License](./package.json).

---

## 🙋‍♂️ Author

**Devesh** — [@deveshh12](https://github.com/deveshh12)
