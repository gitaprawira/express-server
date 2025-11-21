import mongoose from 'mongoose'

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.Promise = Promise

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected successfully!')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect()
    console.log('MongoDB disconnected successfully!')
  } catch (error) {
    console.error('MongoDB disconnection error:', error)
  }
}
