import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import {
  HTTP_OK,
  MESSAGE_REFRESH_TOKEN_NOT_FOUND,
} from '../utils/constans'
import { ResponseBuilder } from '../utils/response-builder'
import { catchAsync } from '../utils/catch-async'
import { AppError } from '../utils/app-error'

export class AuthController {
  private authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }

  /**
   * User Sign In
   */
  signIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const result = await this.authService.authenticate(email, password)
    
    return ResponseBuilder.success(res)
      .withStatusCode(HTTP_OK)
      .withData(result)
      .withCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .send()
  })

  /**   
   * User Sign Up
   */
  signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username, firstname, lastname, image, roles } = req.body
    const result = await this.authService.register(
      email,
      password,
      username,
      firstname,
      lastname,
      image,
      roles,
    )
    
    return ResponseBuilder.success(res)
      .withStatusCode(HTTP_OK)
      .withData(result)
      .send()
  })

  /**
   * User Sign Out
   */
  signOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body
    const result = await this.authService.signOut(refreshToken)

    return ResponseBuilder.success(res)
      .withStatusCode(HTTP_OK)
      .withData(result)
      .clearCookie('refreshToken', { httpOnly: true })
      .send()
  })

  /**
   * Refresh JWT Token
   */
  refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const incomingRefreshToken = req.cookies?.refreshToken

    if (!incomingRefreshToken) {
      throw new AppError(MESSAGE_REFRESH_TOKEN_NOT_FOUND, 401)
    }
    
    const result = await this.authService.tokenRefresh(incomingRefreshToken)

    return ResponseBuilder.success(res)
      .withStatusCode(HTTP_OK)
      .withData(result)
      .send()
  })

  /**
   * Get Current User Info
   */
  me = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('User not authenticated', 401)
    }

    return ResponseBuilder.success(res)
      .withStatusCode(HTTP_OK)
      .withData(req.user)
      .send()
  })
}
