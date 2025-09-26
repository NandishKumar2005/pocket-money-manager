const express = require('express')
const router = express.Router()
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)
router.get('/', getTransactions)
router.get('/:id', getTransaction)
router.post('/', createTransaction)
router.patch('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)

module.exports = router


