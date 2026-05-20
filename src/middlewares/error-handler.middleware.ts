import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/app-error'

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  })
}

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
    })
  } else {
    console.error('ERROR:', err)
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Something went wrong!',
    })
  }
}

const handleCastErrorDB = (err: any): AppError => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400)
}

const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0]
  return new AppError(
    `Duplicate field value: ${value}. Please use another value!`,
    400,
  )
}

const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message)
  return new AppError(`Invalid input data. ${errors.join('. ')}`, 400)
}

const handleJWTError = (): AppError =>
  new AppError('Invalid token. Please log in again!', 401)

const handleJWTExpiredError = (): AppError =>
  new AppError('Your token has expired! Please log in again.', 401)

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
  } else {
    let error = { ...err, message: err.message, name: err.name }

    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError') error = handleJWTError()
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, res)
  }
}
