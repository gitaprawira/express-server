import { Request, Response } from 'express'
import { AuthorizationService } from '../services/authorization.service'
import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_OK,
  MESSAGE_FORBIDDEN,
  MESSAGE_IS_EXISTS,
  MESSAGE_UNEXPECTED_ERROR,
  MESSAGE_REFRESH_TOKEN_NOT_FOUND,
} from '../utils/constans'

export class AuthController {
  private authService: AuthorizationService

  constructor(authService: AuthorizationService) {
    this.authService = authService
  }

  /**
   * User Sign In
   */
  signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        errorMessage: MESSAGE_FORBIDDEN,
        statusCode: HTTP_FORBIDDEN,
      })
    }

    const result = await this.authService.authenticate(email, password)
    if (result) {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      return res.status(HTTP_OK).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_OK,
        data: result,
      })
      .end()
    } else {
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        errorMessage: MESSAGE_FORBIDDEN,
        statusCode: HTTP_FORBIDDEN,
      })
    }
  }

  /**   
   * User Sign Up
   */
  signUp = async (req: Request, res: Response) => {
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
    
    if (result) {
      return res.status(HTTP_OK).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_OK,
        data: result,
      })
      .end()
    } else {
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        errorMessage: MESSAGE_IS_EXISTS,
        statusCode: HTTP_BAD_REQUEST,
      })
    }
  }

  /**
   * User Sign Out
   */
  signOut = async (req: Request, res: Response) => {
    const { refreshToken } = req.body
    const result = await this.authService.signOut(refreshToken)

    if (result) {
      res.clearCookie('refreshToken', { httpOnly: true })
      return res.status(HTTP_OK).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_OK,
        data: result,
      })
      .end()
    } else {
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        errorMessage: MESSAGE_UNEXPECTED_ERROR,
        statusCode: HTTP_BAD_REQUEST,
      })
    }
  }

  /**
   * Refresh JWT Token
   */
  refreshToken = async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: MESSAGE_REFRESH_TOKEN_NOT_FOUND })
    }
    const result = await this.authService.tokenRefresh(incomingRefreshToken)

    if (result) {
      return res.status(HTTP_OK).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_OK,
        data: result,
      })
      .end()
    } else {
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        errorMessage: MESSAGE_UNEXPECTED_ERROR,
        statusCode: HTTP_BAD_REQUEST,
      })
    }
  }

  /**
   * Get Current User Info
   */
  me = async (req: Request, res: Response) => {
    if (req.user) {
      return res.status(HTTP_OK).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_OK,
        data: req.user,
      })
      .end()
    } else {
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        errorMessage: MESSAGE_FORBIDDEN,
        statusCode: HTTP_FORBIDDEN,
      })
    }
  }
}
