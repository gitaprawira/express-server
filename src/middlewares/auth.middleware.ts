import { NextFunction, Request, Response } from 'express'
import { Role, Permission } from '../types/rbac.types'
import { AuthService } from '../services/auth.service'
import { RoleRepository } from '../repositories/role.repository'
import { UserRepository } from '../repositories/user.repository'
import UserModel, { IUser } from '../models/user.model'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_UNAUTHORIZED,
  MESSAGE_UNAUTHORIZED,
  MESSAGE_INVALID_TOKEN,
  MESSAGE_SERVER_CONFIG_ERROR,
  MESSAGE_AUTHENTICATION_FAILED,
  MESSAGE_INSUFFICIENT_PERMISSIONS,
  MESSAGE_JWT_SECRET_NOT_CONFIGURED,
  LOG_AUTHORIZATION_ERROR,
  LOG_AUTH_MIDDLEWARE_ERROR,
} from '../utils/constans'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

// Initialize services (singleton pattern for efficiency)
const roleRepository = new RoleRepository()
const userRepository = new UserRepository()
const authorizationService = new AuthService(roleRepository, userRepository)

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 * Should be used before any RBAC middleware
 */
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

/**
 * Middleware factory to check if user has required permission
 * @param requiredPermission - Permission required to access the route
 */
export const requirePermission = (requiredPermission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(HTTP_UNAUTHORIZED).json({
          success: false,
          message: MESSAGE_UNAUTHORIZED,
        })
      }

      const userRoles = req.user.roles || []
      const result = await authorizationService.hasPermission(
        userRoles,
        requiredPermission,
      )

      if (!result.granted) {
        return res.status(HTTP_FORBIDDEN).json({
          success: false,
          message: result.reason || MESSAGE_INSUFFICIENT_PERMISSIONS,
        })
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: MESSAGE_INSUFFICIENT_PERMISSIONS,
      })
    }
  }
}

/**
 * Middleware factory to check if user has any of the required permissions
 * @param requiredPermissions - Array of permissions (user needs at least one)
 */
export const requireAnyPermission = (requiredPermissions: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(HTTP_UNAUTHORIZED).json({
          success: false,
          message: MESSAGE_UNAUTHORIZED,
        })
      }

      const userRoles = req.user.roles || []
      const result = await authorizationService.hasAnyPermission(
        userRoles,
        requiredPermissions,
      )

      if (!result.granted) {
        return res.status(HTTP_FORBIDDEN).json({
          success: false,
          message: result.reason || MESSAGE_INSUFFICIENT_PERMISSIONS,
        })
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: MESSAGE_INSUFFICIENT_PERMISSIONS,
      })
    }
  }
}

/**
 * Middleware factory to check if user has all required permissions
 * @param requiredPermissions - Array of permissions (user needs all)
 */
export const requireAllPermissions = (requiredPermissions: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(HTTP_UNAUTHORIZED).json({
          success: false,
          message: MESSAGE_UNAUTHORIZED,
        })
      }

      const userRoles = req.user.roles || []
      const result = await authorizationService.hasAllPermissions(
        userRoles,
        requiredPermissions,
      )

      if (!result.granted) {
        return res.status(HTTP_FORBIDDEN).json({
          success: false,
          message: result.reason || MESSAGE_INSUFFICIENT_PERMISSIONS,
        })
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: MESSAGE_INSUFFICIENT_PERMISSIONS,
      })
    }
  }
}

/**
 * Middleware factory to check if user has required role
 * @param requiredRole - Role required to access the route
 */
export const requireRole = (requiredRole: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(HTTP_UNAUTHORIZED).json({
          success: false,
          message: MESSAGE_UNAUTHORIZED,
        })
      }

      const userRoles = req.user.roles || []
      const result = await authorizationService.hasRole(userRoles, requiredRole)

      if (!result.granted) {
        return res.status(HTTP_FORBIDDEN).json({
          success: false,
          message: result.reason || MESSAGE_INSUFFICIENT_PERMISSIONS,
        })
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: MESSAGE_INSUFFICIENT_PERMISSIONS,
      })
    }
  }
}

/**
 * Middleware factory to check if user has any of the required roles
 * @param requiredRoles - Array of roles (user needs at least one)
 */
export const requireAnyRole = (requiredRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(HTTP_UNAUTHORIZED).json({
          success: false,
          message: MESSAGE_UNAUTHORIZED,
        })
      }

      const userRoles = req.user.roles || []
      const result = await authorizationService.hasAnyRole(
        userRoles,
        requiredRoles,
      )

      if (!result.granted) {
        return res.status(HTTP_FORBIDDEN).json({
          success: false,
          message: result.reason || MESSAGE_INSUFFICIENT_PERMISSIONS,
        })
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: MESSAGE_INSUFFICIENT_PERMISSIONS,
      })
    }
  }
}

/**
 * Middleware to check if user is owner of the resource OR has admin privileges
 * @param resourceIdParam - Name of the parameter containing the resource ID (default: 'id')
 */
export const requireOwnershipOrAdmin = (resourceIdParam: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(HTTP_UNAUTHORIZED).json({
          success: false,
          message: MESSAGE_UNAUTHORIZED,
        })
      }

      const resourceOwnerId = req.params[resourceIdParam]
      const userId = req.user._id.toString()
      const userRoles = req.user.roles || []

      // Check if user is owner
      const isOwner = authorizationService.isOwner(userId, resourceOwnerId)
      if (isOwner.granted) {
        return next()
      }

      // Check if user has admin role
      const hasAdminRole = await authorizationService.hasAnyRole(userRoles, [
        Role.SUPER_ADMIN,
        Role.ADMIN,
      ])
      if (hasAdminRole.granted) {
        return next()
      }

      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: MESSAGE_INSUFFICIENT_PERMISSIONS,
      })
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: MESSAGE_INSUFFICIENT_PERMISSIONS,
      })
    }
  }
}

/**
 * Middleware to check if user is owner of the resource OR has specific permission
 * @param resourceIdParam - Name of the parameter containing the resource ID
 * @param permission - Permission to check if not owner
 */
export const requireOwnershipOrPermission = (
  resourceIdParam: string,
  permission: Permission,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(HTTP_UNAUTHORIZED).json({
          success: false,
          message: MESSAGE_UNAUTHORIZED,
        })
      }

      const resourceOwnerId = req.params[resourceIdParam]
      const userId = req.user._id.toString()
      const userRoles = req.user.roles || []

      // Check if user is owner
      const isOwner = authorizationService.isOwner(userId, resourceOwnerId)
      if (isOwner.granted) {
        return next()
      }

      // Check if user has the required permission
      const hasPermission = await authorizationService.hasPermission(
        userRoles,
        permission,
      )
      if (hasPermission.granted) {
        return next()
      }

      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: MESSAGE_INSUFFICIENT_PERMISSIONS,
      })
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: MESSAGE_INSUFFICIENT_PERMISSIONS,
      })
    }
  }
}
