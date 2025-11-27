/**
 * Custom Application Error Class
 * 
 * Extends the native Error class to provide structured error handling
 * across the application with support for HTTP status codes and
 * operational vs programming error distinction.
 * 
 * @example
 * throw new AppError('User not found', 404)
 * throw new AppError('Invalid input', 400)
 */
export class AppError extends Error {
  statusCode: number
  status: string
  isOperational: boolean

  /**
   * Creates an instance of AppError
   * 
   * @param message - Human-readable error message
   * @param statusCode - HTTP status code (default: 500)
   * @param isOperational - Whether error is operational/trusted (default: true)
   */
  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = isOperational
    
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor)
  }
}
