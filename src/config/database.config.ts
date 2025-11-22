import mongoose from 'mongoose'

/**
 * Connect to MongoDB using Mongoose
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.Promise = Promise

    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URL is not defined in environment variables')
    }

    await mongoose.connect(process.env.MONGODB_URL)
    console.log('MongoDB connected successfully!')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

/** 
 * Disconnect from MongoDB
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect()
    console.log('MongoDB disconnected successfully!')
  } catch (error) {
    console.error('MongoDB disconnection error:', error)
  }
}
