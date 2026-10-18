const asyncHandler = require('express-async-handler')
const Transaction = require('../models/Transaction')

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const AI_MODEL = 'mistralai/mistral-7b-instruct:free'

const callAI = async (systemPrompt, messages) => {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured on server')

  const payload = {
    model: AI_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  }

  let response
  let delay = 1000
  for (let i = 0; i < 3; i++) {
    response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Pocket Money Manager',
      },
      body: JSON.stringify(payload),
    })
    if (response.ok) break
    if (response.status === 429 || response.status >= 500) {
      await new Promise((r) => setTimeout(r, delay))
      delay *= 2
    } else break
  }

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`AI API error ${response.status}: ${errText}`)
  }

  const result = await response.json()
  const text = result.choices?.[0]?.message?.content
  if (!text) throw new Error('Empty response from AI')
  return text
}

const chatSystemPrompt = `You are PocketPal, a friendly AI assistant for the "Pocket Money Manager" web app.
The app has three sections:
1. Dashboard: balance, income vs expenses, recent transactions.
2. Transactions: add/edit/delete income or expense entries (description, amount, type, category).
3. Analytics: charts visualizing spending habits by category.

Keep answers concise, friendly, and focused on personal finance and app usage.
If asked something unrelated, gently guide back to finance topics.`

// @desc  Chat with PocketPal AI
// @route POST /api/ai/chat
// @access Private
const chat = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body
  if (!message) {
    res.status(400)
    throw new Error('message is required')
  }

  const messages = [
    ...history.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
    { role: 'user', content: message },
  ]

  const reply = await callAI(chatSystemPrompt, messages)
  res.json({ reply })
})

// @desc  AI investment analysis based on user transactions
// @route GET /api/ai/analyze
// @access Private
const analyze = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 }).limit(100)

  if (!transactions.length) {
    return res.json({
      analysis: "You don't have any transactions yet. Start adding your income and expenses to get personalised investment advice!",
    })
  }

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0

  const expenseByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const incomeByCategory = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const summary = `
User Financial Summary:
- Total Income: ₹${totalIncome.toLocaleString()}
- Total Expenses: ₹${totalExpenses.toLocaleString()}
- Current Balance: ₹${balance.toLocaleString()}
- Savings Rate: ${savingsRate}%
- Expense Breakdown: ${JSON.stringify(expenseByCategory)}
- Income Sources: ${JSON.stringify(incomeByCategory)}
- Total Transactions Analyzed: ${transactions.length}
`

  const analysisPrompt = `You are a friendly personal finance and investment advisor AI.
Analyze the following financial data and provide:
1. A brief assessment of the user's financial health (2-3 sentences)
2. Top 3 specific, actionable investment suggestions based on their savings rate and spending patterns
3. One key area where they could reduce spending to invest more
4. A simple investment allocation suggestion (e.g., % in FD, mutual funds, stocks, emergency fund)

Keep the tone encouraging and practical. Use Indian financial context (₹, FDs, SIPs, mutual funds).
Format the response with clear sections using emojis for readability.`

  const messages = [{ role: 'user', content: summary }]
  const analysis = await callAI(analysisPrompt, messages)
  res.json({ analysis })
})

module.exports = { chat, analyze }
