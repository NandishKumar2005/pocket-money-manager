// server.js
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const { errorHandler } = require('./middleware/errorMiddleware')

dotenv.config({ path: path.join(__dirname, '.env'), override: true })
// Temporary sanity check to ensure envs are loaded
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
  console.warn('MONGODB_URI is not set from .env; please check .env loading')
}

// connect to MongoDB
connectDB()

const app = express()

// CORS middleware
// Allow localhost for development and deployed frontend URL for production
const allowedOrigins = [
  // Development origins
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

// Add production frontend URL if provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
  console.log('Added FRONTEND_URL to CORS origins:', process.env.FRONTEND_URL);
}

// Also allow common Vercel preview deployments
allowedOrigins.push(
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/.*-vercel-app\.vercel\.app$/
);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin matches any of the allowed patterns
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      console.log(`CORS: Allowing origin: ${origin}`);
      callback(null, true);
    } else {
      console.log(`CORS: Blocking origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  console.log(`Server accessible at:`)
  console.log(`  - http://localhost:${PORT}`)
  console.log(`  - http://127.0.0.1:${PORT}`)
})


