import { NextFunction, Request, Response } from 'express'
import UserModel, { IUser } from '../models/user.model'
import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_UNAUTHORIZED,
  MESSAGE_UNAUTHORIZED,
  MESSAGE_FORBIDDEN,
  MESSAGE_INVALID_TOKEN,
  MESSAGE_SERVER_CONFIG_ERROR,
  MESSAGE_AUTHENTICATION_FAILED,
  MESSAGE_AUTHORIZATION_CHECK_FAILED,
  MESSAGE_OWNERSHIP_CHECK_FAILED,
  MESSAGE_JWT_SECRET_NOT_CONFIGURED,
  LOG_AUTH_MIDDLEWARE_ERROR,
} from '../utils/constans'
import jwt, { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract token from Authorization header
    let token: string | undefined
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(HTTP_UNAUTHORIZED).json({
        success: false,
        message: MESSAGE_UNAUTHORIZED,
      })
    }

    // Verify JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error(MESSAGE_JWT_SECRET_NOT_CONFIGURED)
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        message: MESSAGE_SERVER_CONFIG_ERROR,
      })
    }

    // Verify token using ACCESS token secret (not refresh token secret)
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

    // Find user by ID from token
    const currentUser = await UserModel.findById(decoded.id)
    if (!currentUser) {
      return res.status(HTTP_UNAUTHORIZED).json({
        success: false,
        message: MESSAGE_UNAUTHORIZED,
      })
    }

    // Attach user to request object
    req.user = currentUser
    return next()
  } catch (error) {
    console.error(LOG_AUTH_MIDDLEWARE_ERROR, error)
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(HTTP_UNAUTHORIZED).json({
        success: false,
        message: MESSAGE_INVALID_TOKEN,
      })
    }

    return res.status(HTTP_BAD_REQUEST).json({
      success: false,
      message: MESSAGE_AUTHENTICATION_FAILED,
    })
  }
}

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check if user exists in request (from isAuthenticated middleware)
    if (!req.user) {
      return res.status(HTTP_UNAUTHORIZED).json({
        success: false,
        message: MESSAGE_UNAUTHORIZED,
      })
    }

    // Check if user has admin privileges
    if (!req.user.isAdmin) {
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: MESSAGE_FORBIDDEN,
      })
    }

    return next()
  } catch (error) {
    console.error(LOG_AUTH_MIDDLEWARE_ERROR, error)
    return res.status(HTTP_BAD_REQUEST).json({
      success: false,
      message: MESSAGE_AUTHORIZATION_CHECK_FAILED,
    })
  }
}

export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check if user exists in request (from isAuthenticated middleware)
    if (!req.user) {
      return res.status(HTTP_UNAUTHORIZED).json({
        success: false,
        message: MESSAGE_UNAUTHORIZED,
      })
    }

    const resourceOwnerId = req.params.userId // Assuming the resource owner ID is in req.params.userId

    // Check if the authenticated user is the owner of the resource
    if (req.user._id.toString() !== resourceOwnerId) {
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: MESSAGE_FORBIDDEN,
      })
    }

    return next()
  } catch (error) {
    console.error(LOG_AUTH_MIDDLEWARE_ERROR, error)
    return res.status(HTTP_BAD_REQUEST).json({
      success: false,
      message: MESSAGE_OWNERSHIP_CHECK_FAILED,
    })
  }
}