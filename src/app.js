const express = require("express")
const cookieParser = require("cookie-parser")



const app = express()

const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4173'
app.use((req, res, next) => {
    const origin = req.headers.origin
    if (origin && origin === allowedOrigin) {
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Credentials', 'true')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204)
    next()
})

app.use(express.json())
app.use(cookieParser())

/**
 * - Routes required
 */
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")

/**
 * - Use Routes
 */

app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)

app.use((error, _req, res, _next) => {
    console.error(error)
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message })
    if (error.code === 11000) return res.status(409).json({ message: 'That record already exists.' })
    return res.status(500).json({ message: 'An unexpected server error occurred.' })
})

module.exports = app
