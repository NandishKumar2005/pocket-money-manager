const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    // Support both MONGODB_URI (standard) and MONGO_URI (legacy) environment variables
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MongoDB URI not found. Please set MONGODB_URI or MONGO_URI environment variable.');
    }
    
    const conn = await mongoose.connect(mongoUri, {
      // Keep options minimal; Mongoose 8 no longer needs legacy flags
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB


