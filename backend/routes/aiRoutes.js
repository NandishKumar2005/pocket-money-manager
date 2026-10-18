const express = require('express')
const router = express.Router()
const { chat, analyze } = require('../controllers/aiController')
const { protect } = require('../middleware/authMiddleware')

router.post('/chat', protect, chat)
router.get('/analyze', protect, analyze)

module.exports = router
