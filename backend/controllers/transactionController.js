// controllers/transactionController.js
const asyncHandler = require('express-async-handler')
const Transaction = require('../models/Transaction')

// @desc    Get all transactions for logged-in user
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 })
  res.json(transactions)
})

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
  if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
    res.status(404)
    throw new Error('Transaction not found')
  }
  res.json(transaction)
})

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, date, note } = req.body
  const transaction = await Transaction.create({
    user: req.user._id,
    type,
    category,
    amount,
    date,
    note,
  })
  res.status(201).json(transaction)
})

// @desc    Update transaction
// @route   PATCH /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
  if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
    res.status(404)
    throw new Error('Transaction not found or not authorized')
  }

  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(updated)
})

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
  if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
    res.status(404)
    throw new Error('Transaction not found or not authorized')
  }
  await transaction.deleteOne()
  res.json({ message: 'Transaction removed', id: req.params.id })
})

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
}