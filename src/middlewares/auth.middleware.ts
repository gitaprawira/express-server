import { NextFunction, Request, Response } from 'express'
import { Role, Permission } from '../types/rbac.types'
import { rbacService } from '../container'
import { ResponseBuilder } from '../utils/response-builder'
import UserModel, { IUser } from '../models/user.model'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {
  MESSAGE_UNAUTHORIZED,
  MESSAGE_INVALID_TOKEN,
  MESSAGE_SERVER_CONFIG_ERROR,
  MESSAGE_AUTHENTICATION_FAILED,
  MESSAGE_INSUFFICIENT_PERMISSIONS,
  MESSAGE_JWT_SECRET_NOT_CONFIGURED,
  LOG_AUTHORIZATION_ERROR,
  LOG_AUTH_MIDDLEWARE_ERROR,
} from '../utils/constans'
import {
  HTTP_UNAUTHORIZED,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
} from '../utils/constans'

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
    let token: string | undefined
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_UNAUTHORIZED)
        .withMessage(MESSAGE_UNAUTHORIZED)
        .send()
    }

    if (!process.env.JWT_SECRET) {
      console.error(MESSAGE_JWT_SECRET_NOT_CONFIGURED)
      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_INTERNAL_SERVER_ERROR)
        .withMessage(MESSAGE_SERVER_CONFIG_ERROR)
        .send()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

    const currentUser = await UserModel.findById(decoded.id)
    if (!currentUser) {
      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_UNAUTHORIZED)
        .withMessage(MESSAGE_UNAUTHORIZED)
        .send()
    }

    req.user = currentUser
    return next()
  } catch (error) {
    console.error(LOG_AUTH_MIDDLEWARE_ERROR, error)

    if (error instanceof jwt.JsonWebTokenError) {
      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_UNAUTHORIZED)
        .withMessage(MESSAGE_INVALID_TOKEN)
        .send()
    }

    return ResponseBuilder.error(res)
      .withStatusCode(HTTP_UNAUTHORIZED)
      .withMessage(MESSAGE_AUTHENTICATION_FAILED)
      .send()
  }
}

export const requirePermission = (requiredPermission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_UNAUTHORIZED)
          .withMessage(MESSAGE_UNAUTHORIZED)
          .send()
      }

      const result = await rbacService.hasPermission(
        req.user.roles ?? [],
        requiredPermission,
      )

      if (!result.granted) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_FORBIDDEN)
          .withMessage(result.reason ?? MESSAGE_INSUFFICIENT_PERMISSIONS)
          .send()
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_FORBIDDEN)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    }
  }
}

export const requireAnyPermission = (requiredPermissions: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_UNAUTHORIZED)
          .withMessage(MESSAGE_UNAUTHORIZED)
          .send()
      }

      const result = await rbacService.hasAnyPermission(
        req.user.roles ?? [],
        requiredPermissions,
      )

      if (!result.granted) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_FORBIDDEN)
          .withMessage(result.reason ?? MESSAGE_INSUFFICIENT_PERMISSIONS)
          .send()
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_FORBIDDEN)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    }
  }
}

export const requireAllPermissions = (requiredPermissions: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_UNAUTHORIZED)
          .withMessage(MESSAGE_UNAUTHORIZED)
          .send()
      }

      const result = await rbacService.hasAllPermissions(
        req.user.roles ?? [],
        requiredPermissions,
      )

      if (!result.granted) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_FORBIDDEN)
          .withMessage(result.reason ?? MESSAGE_INSUFFICIENT_PERMISSIONS)
          .send()
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_FORBIDDEN)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    }
  }
}

export const requireRole = (requiredRole: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_UNAUTHORIZED)
          .withMessage(MESSAGE_UNAUTHORIZED)
          .send()
      }

      const result = rbacService.hasRole(req.user.roles ?? [], requiredRole)

      if (!result.granted) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_FORBIDDEN)
          .withMessage(result.reason ?? MESSAGE_INSUFFICIENT_PERMISSIONS)
          .send()
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_FORBIDDEN)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    }
  }
}

export const requireAnyRole = (requiredRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_UNAUTHORIZED)
          .withMessage(MESSAGE_UNAUTHORIZED)
          .send()
      }

      const result = rbacService.hasAnyRole(req.user.roles ?? [], requiredRoles)

      if (!result.granted) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_FORBIDDEN)
          .withMessage(result.reason ?? MESSAGE_INSUFFICIENT_PERMISSIONS)
          .send()
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_FORBIDDEN)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    }
  }
}

export const requireOwnershipOrAdmin = (resourceIdParam: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_UNAUTHORIZED)
          .withMessage(MESSAGE_UNAUTHORIZED)
          .send()
      }

      const resourceOwnerId = req.params[resourceIdParam]
      const userId = req.user._id.toString()

      if (rbacService.isOwner(userId, resourceOwnerId).granted) return next()

      if (
        rbacService.hasAnyRole(req.user.roles ?? [], [
          Role.SUPER_ADMIN,
          Role.ADMIN,
        ]).granted
      ) {
        return next()
      }

      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_FORBIDDEN)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_FORBIDDEN)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    }
  }
}

export const requireOwnershipOrPermission = (
  resourceIdParam: string,
  permission: Permission,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return ResponseBuilder.error(res)
          .withStatusCode(HTTP_UNAUTHORIZED)
          .withMessage(MESSAGE_UNAUTHORIZED)
          .send()
      }

      const resourceOwnerId = req.params[resourceIdParam]
      const userId = req.user._id.toString()

      if (rbacService.isOwner(userId, resourceOwnerId).granted) return next()

      const hasPermission = await rbacService.hasPermission(
        req.user.roles ?? [],
        permission,
      )
      if (hasPermission.granted) return next()

      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_FORBIDDEN)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(HTTP_FORBIDDEN)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    }
  }
}
