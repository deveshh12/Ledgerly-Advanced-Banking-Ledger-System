const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const emailService = require('../services/email.service');

const asAmount = (value) => Number(value);

async function getPrimaryAccount(userId) {
    return accountModel.findOne({ user: userId, status: 'ACTIVE' });
}

async function existingTransaction(idempotencyKey, res) {
    const existing = await transactionModel.findOne({ idempotencyKey });
    if (!existing) return false;
    if (existing.status === 'COMPLETED') {
        res.status(200).json({ message: 'Transaction already processed', transaction: existing });
    } else {
        res.status(409).json({ message: 'A transaction with this idempotency key is still being processed.' });
    }
    return true;
}

async function recordTransaction({ fromAccount, toAccount, amount, idempotencyKey, entries }) {
    const transaction = await transactionModel.create({ fromAccount, toAccount, amount, idempotencyKey, status: 'PENDING' });
    await ledgerModel.insertMany(entries.map((entry) => ({ ...entry, transaction: transaction._id, amount })));
    transaction.status = 'COMPLETED';
    await transaction.save();
    return transaction;
}

function validateMoneyRequest(req, res) {
    const { amount, idempotencyKey } = req.body;
    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
        res.status(400).json({ message: 'A valid idempotencyKey is required.' });
        return false;
    }
    if (!Number.isFinite(asAmount(amount)) || asAmount(amount) <= 0) {
        res.status(400).json({ message: 'Amount must be greater than zero.' });
        return false;
    }
    return true;
}

async function deposit(req, res) {
    if (!validateMoneyRequest(req, res)) return;
    if (await existingTransaction(req.body.idempotencyKey, res)) return;
    const account = await getPrimaryAccount(req.user._id);
    if (!account) return res.status(404).json({ message: 'No active account found.' });
    try {
        const transaction = await recordTransaction({
            fromAccount: account._id, toAccount: account._id, amount: asAmount(req.body.amount), idempotencyKey: req.body.idempotencyKey,
            entries: [{ account: account._id, type: 'CREDIT' }]
        });
        return res.status(201).json({ message: 'Deposit completed successfully', transaction });
    } catch (error) {
        if (error.code === 11000) return existingTransaction(req.body.idempotencyKey, res);
        return res.status(500).json({ message: 'Could not process your deposit. Please try again.' });
    }
}

async function withdraw(req, res) {
    if (!validateMoneyRequest(req, res)) return;
    if (await existingTransaction(req.body.idempotencyKey, res)) return;
    const account = await getPrimaryAccount(req.user._id);
    if (!account) return res.status(404).json({ message: 'No active account found.' });
    const amount = asAmount(req.body.amount);
    if (await account.getBalance() < amount) return res.status(400).json({ message: 'Insufficient balance for this withdrawal.' });
    try {
        const transaction = await recordTransaction({
            fromAccount: account._id, toAccount: account._id, amount, idempotencyKey: req.body.idempotencyKey,
            entries: [{ account: account._id, type: 'DEBIT' }]
        });
        return res.status(201).json({ message: 'Withdrawal completed successfully', transaction });
    } catch (error) {
        if (error.code === 11000) return existingTransaction(req.body.idempotencyKey, res);
        return res.status(500).json({ message: 'Could not process your withdrawal. Please try again.' });
    }
}

async function transfer(req, res) {
    if (!validateMoneyRequest(req, res)) return;
    const { toAccountId, idempotencyKey } = req.body;
    if (!toAccountId) return res.status(400).json({ message: 'A recipient account ID is required.' });
    if (await existingTransaction(idempotencyKey, res)) return;
    const fromAccount = await getPrimaryAccount(req.user._id);
    const toAccount = await accountModel.findOne({ _id: toAccountId, status: 'ACTIVE' });
    if (!fromAccount || !toAccount) return res.status(404).json({ message: 'Sender or recipient account was not found.' });
    if (String(fromAccount._id) === String(toAccount._id)) return res.status(400).json({ message: 'You cannot transfer to the same account.' });
    const amount = asAmount(req.body.amount);
    if (await fromAccount.getBalance() < amount) return res.status(400).json({ message: 'Insufficient balance for this transfer.' });
    try {
        const transaction = await recordTransaction({
            fromAccount: fromAccount._id, toAccount: toAccount._id, amount, idempotencyKey,
            entries: [{ account: fromAccount._id, type: 'DEBIT' }, { account: toAccount._id, type: 'CREDIT' }]
        });
        emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccountId);
        return res.status(201).json({ message: 'Transfer completed successfully', transaction });
    } catch (error) {
        if (error.code === 11000) return existingTransaction(idempotencyKey, res);
        return res.status(500).json({ message: 'Could not process your transfer. Please try again.' });
    }
}

async function balance(req, res) {
    const account = await getPrimaryAccount(req.user._id);
    if (!account) return res.status(404).json({ message: 'No active account found.' });
    return res.status(200).json({ accountId: account._id, balance: await account.getBalance() });
}

async function history(req, res) {
    const account = await getPrimaryAccount(req.user._id);
    if (!account) return res.status(404).json({ message: 'No active account found.' });
    const entries = await ledgerModel.find({ account: account._id }).populate('transaction').sort({ createdAt: -1 });
    const transactions = entries.filter((entry) => entry.transaction).map((entry) => {
        const transaction = entry.transaction;
        const internal = String(transaction.fromAccount) === String(transaction.toAccount);
        return {
            id: entry._id,
            type: internal ? (entry.type === 'CREDIT' ? 'deposit' : 'withdraw') : 'transfer',
            direction: entry.type === 'DEBIT' ? 'debit' : 'credit',
            amount: entry.amount,
            createdAt: entry.createdAt || transaction.createdAt,
            status: transaction.status
        };
    });
    return res.status(200).json({ transactions });
}

module.exports = { deposit, withdraw, transfer, balance, history, createTransaction: transfer };
