import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { connectDatabase } from './config/database.config'

const port = process.env.PORT || 8080

// Connect to database
connectDatabase()

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
  console.log(
    `API Documentation available at http://localhost:${port}/api-docs`,
  )
})
