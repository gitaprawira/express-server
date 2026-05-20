import { Response } from 'express'

interface ApiResponse<T = any> {
  success: boolean
  statusCode: number
  message?: string
  data?: T
}

export class ResponseBuilder {
  private response: Response
  private statusCode: number
  private body: ApiResponse

  private constructor(res: Response, success: boolean) {
    this.response = res
    this.statusCode = 200
    this.body = { success, statusCode: 200 }
  }

  static success(res: Response): ResponseBuilder {
    return new ResponseBuilder(res, true)
  }

  static error(res: Response): ResponseBuilder {
    return new ResponseBuilder(res, false)
  }

  withStatusCode(statusCode: number): ResponseBuilder {
    this.statusCode = statusCode
    this.body.statusCode = statusCode
    return this
  }

  withData<T>(data: T): ResponseBuilder {
    this.body.data = data
    return this
  }

  withMessage(message: string): ResponseBuilder {
    this.body.message = message
    return this
  }

  withCookie(name: string, value: string, options?: any): ResponseBuilder {
    this.response.cookie(name, value, options)
    return this
  }

  clearCookie(name: string, options?: any): ResponseBuilder {
    this.response.clearCookie(name, options)
    return this
  }

  send(): Response {
    return this.response.status(this.statusCode).json(this.body).end()
  }
}
