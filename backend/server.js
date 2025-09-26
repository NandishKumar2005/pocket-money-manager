// server.js
const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const { errorHandler } = require('./middleware/errorMiddleware')

dotenv.config({ path: path.join(__dirname, '.env'), override: true })
// Temporary sanity check to ensure envs are loaded
if (!process.env.MONGO_URI) {
  console.warn('MONGO_URI is not set from .env; please check .env loading')
}

// connect to MongoDB
connectDB()

const app = express()

// built-in middleware to parse JSON bodies
app.use(express.json())

// health check
app.get('/', (req, res) => {
  res.send({ message: 'Pocket Money Manager API is running' })
})

// mount routers
app.use('/api/users', userRoutes)
app.use('/api/transactions', transactionRoutes)

// custom error handler (catches exceptions & 404s)
app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)


