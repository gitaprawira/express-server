import { Response } from 'express'

interface ApiResponse<T = any> {
  success: boolean
  errorMessage: string | null
  statusCode: number
  data?: T
}

/**
 * ResponseBuilder - A utility class for building consistent API responses
 * 
 * This class provides a fluent interface for creating standardized HTTP responses
 * across all controllers, ensuring consistency and reducing code duplication.
 * 
 * @example
 * return ResponseBuilder.success(res)
 *   .withData(users)
 *   .withStatusCode(HTTP_OK)
 *   .send()
 */
export class ResponseBuilder {
  private response: Response
  private statusCode: number
  private body: ApiResponse

  private constructor(res: Response, success: boolean) {
    this.response = res
    this.statusCode = 200
    this.body = {
      success,
      errorMessage: null,
      statusCode: 200,
    }
  }

  /**
   * Creates a success response builder
   */
  static success(res: Response): ResponseBuilder {
    return new ResponseBuilder(res, true)
  }

  /**
   * Creates an error response builder
   */
  static error(res: Response): ResponseBuilder {
    return new ResponseBuilder(res, false)
  }

  /**
   * Sets the HTTP status code for the response
   */
  withStatusCode(statusCode: number): ResponseBuilder {
    this.statusCode = statusCode
    this.body.statusCode = statusCode
    return this
  }

  /**
   * Sets the data payload for the response
   */
  withData<T>(data: T): ResponseBuilder {
    this.body.data = data
    return this
  }

  /**
   * Sets the error message for the response
   */
  withMessage(message: string): ResponseBuilder {
    this.body.errorMessage = message
    return this
  }

  /**
   * Sets a cookie in the response
   */
  withCookie(name: string, value: string, options?: any): ResponseBuilder {
    this.response.cookie(name, value, options)
    return this
  }

  /**
   * Clears a cookie from the response
   */
  clearCookie(name: string, options?: any): ResponseBuilder {
    this.response.clearCookie(name, options)
    return this
  }

  /**
   * Sends the response to the client
   */
  send(): Response {
    return this.response.status(this.statusCode).json(this.body).end()
  }
}
