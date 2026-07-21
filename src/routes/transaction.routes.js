const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const transactionController = require('../controllers/transaction.controller');

const router = Router();
router.get('/balance', authMiddleware, transactionController.balance);
router.get('/history', authMiddleware, transactionController.history);
router.post('/deposit', authMiddleware, transactionController.deposit);
router.post('/withdraw', authMiddleware, transactionController.withdraw);
router.post('/transfer', authMiddleware, transactionController.transfer);
// Kept for existing API clients; it uses the same documented transfer body.
router.post('/', authMiddleware, transactionController.transfer);
module.exports = router;
