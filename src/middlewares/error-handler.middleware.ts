import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/app-error'

/**
 * Development Error Response
 * Provides detailed error information including stack traces
 */
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

/**
 * Production Error Response
 * Sanitizes error messages and hides implementation details
 */
const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      statusCode: err.statusCode,
      data: null,
    })
  }
  // Programming or unknown error: don't leak error details
  else {
    console.error('ERROR 💥:', err)

    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong!',
      statusCode: 500,
      data: null,
    })
  }
}

/**
 * Handle CastError from MongoDB (invalid ObjectId)
 */
const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

/**
 * Handle Duplicate Field Error from MongoDB
 */
const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0]
  const message = `Duplicate field value: ${value}. Please use another value!`
  return new AppError(message, 400)
}

/**
 * Handle Validation Error from MongoDB/Mongoose
 */
const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

/**
 * Handle JWT Invalid Token Error
 */
const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please log in again!', 401)
}

/**
 * Handle JWT Expired Token Error
 */
const handleJWTExpiredError = (): AppError => {
  return new AppError('Your token has expired! Please log in again.', 401)
}

/**
 * Global Error Handler Middleware
 *
 * Centralized error handling that distinguishes between development
 * and production environments, and between operational and programming errors.
 *
 * This middleware should be registered AFTER all routes in app.ts
 *
 * @example
 * // In app.ts
 * app.use(globalErrorHandler)
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    error.message = err.message
    error.name = err.name

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, res)
  } else {
    // Default to production mode for safety
    sendErrorProd(err, res)
  }
}
