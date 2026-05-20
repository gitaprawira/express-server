import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { connectDatabase, disconnectDatabase } from './config/database.config'

const port = process.env.PORT || 8080

const start = async () => {
  await connectDatabase()

  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
    console.log(
      `API Documentation available at http://localhost:${port}/api-docs`,
    )
  })

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`)
    server.close(async () => {
      await disconnectDatabase()
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason)
    process.exit(1)
  })
}

start()
