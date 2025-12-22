import { NextFunction, Request, Response } from 'express'
import { Role, Permission } from '../types/rbac.types'
import { AuthService } from '../services/auth.service'
import { RoleRepository } from '../repositories/role.repository'
import { UserRepository } from '../repositories/user.repository'
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
const authService = new AuthService(roleRepository, userRepository)

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
      return ResponseBuilder.error(res)
        .withStatusCode(401)
        .withMessage(MESSAGE_UNAUTHORIZED)
        .send()
    }

    // Verify JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error(MESSAGE_JWT_SECRET_NOT_CONFIGURED)
      return ResponseBuilder.error(res)
        .withStatusCode(400)
        .withMessage(MESSAGE_SERVER_CONFIG_ERROR)
        .send()
    }

    // Verify token using ACCESS token secret (not refresh token secret)
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

    // Find user by ID from token
    const currentUser = await UserModel.findById(decoded.id)
    if (!currentUser) {
      return ResponseBuilder.error(res)
        .withStatusCode(401)
        .withMessage(MESSAGE_UNAUTHORIZED)
        .send()
    }

    // Attach user to request object
    req.user = currentUser
    return next()
  } catch (error) {
    console.error(LOG_AUTH_MIDDLEWARE_ERROR, error)
    
    if (error instanceof jwt.JsonWebTokenError) {
      return ResponseBuilder.error(res)
        .withStatusCode(401)
        .withMessage(MESSAGE_INVALID_TOKEN)
        .send()
    }

    return ResponseBuilder.error(res)
      .withStatusCode(400)
      .withMessage(MESSAGE_AUTHENTICATION_FAILED)
      .send()
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
        return ResponseBuilder.error(res)
        .withStatusCode(401)
        .withMessage(MESSAGE_UNAUTHORIZED)
        .send()
      }

      const userRoles = req.user.roles || []
      const result = await authService.hasPermission(
        userRoles,
        requiredPermission,
      )

      if (!result.granted) {
        return ResponseBuilder.error(res)
          .withStatusCode(403)
          .withMessage(result.reason || MESSAGE_INSUFFICIENT_PERMISSIONS)
          .send()
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(403)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
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
        return ResponseBuilder.error(res)
        .withStatusCode(401)
        .withMessage(MESSAGE_UNAUTHORIZED)
        .send()
      }

      const userRoles = req.user.roles || []
      const result = await authService.hasAnyPermission(
        userRoles,
        requiredPermissions,
      )

      if (!result.granted) {
        return ResponseBuilder.error(res)
          .withStatusCode(403)
          .withMessage(result.reason || MESSAGE_INSUFFICIENT_PERMISSIONS)
          .send()
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(403)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
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
        return ResponseBuilder.error(res)
        .withStatusCode(401)
        .withMessage(MESSAGE_UNAUTHORIZED)
        .send()
      }

      const userRoles = req.user.roles || []
      const result = await authService.hasAllPermissions(
        userRoles,
        requiredPermissions,
      )

      if (!result.granted) {
        return ResponseBuilder.error(res)
          .withStatusCode(403)
          .withMessage(result.reason || MESSAGE_INSUFFICIENT_PERMISSIONS)
          .send()
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(403)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
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
        return ResponseBuilder.error(res)
        .withStatusCode(401)
        .withMessage(MESSAGE_UNAUTHORIZED)
        .send()
      }

      const userRoles = req.user.roles || []
      const result = await authService.hasRole(userRoles, requiredRole)

      if (!result.granted) {
        return ResponseBuilder.error(res)
          .withStatusCode(403)
          .withMessage(result.reason || MESSAGE_INSUFFICIENT_PERMISSIONS)
          .send()
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(403)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
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
        return ResponseBuilder.error(res)
        .withStatusCode(401)
        .withMessage(MESSAGE_UNAUTHORIZED)
        .send()
      }

      const userRoles = req.user.roles || []
      const result = await authService.hasAnyRole(
        userRoles,
        requiredRoles,
      )

      if (!result.granted) {
        return ResponseBuilder.error(res)
          .withStatusCode(403)
          .withMessage(result.reason || MESSAGE_INSUFFICIENT_PERMISSIONS)
          .send()
      }

      return next()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(403)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
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
        return ResponseBuilder.error(res)
        .withStatusCode(401)
        .withMessage(MESSAGE_UNAUTHORIZED)
        .send()
      }

      const resourceOwnerId = req.params[resourceIdParam]
      const userId = req.user._id.toString()
      const userRoles = req.user.roles || []

      // Check if user is owner
      const isOwner = authService.isOwner(userId, resourceOwnerId)
      if (isOwner.granted) {
        return next()
      }

      // Check if user has admin role
      const hasAdminRole = await authService.hasAnyRole(userRoles, [
        Role.SUPER_ADMIN,
        Role.ADMIN,
      ])
      if (hasAdminRole.granted) {
        return next()
      }

      return ResponseBuilder.error(res)
        .withStatusCode(403)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(403)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
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
        return ResponseBuilder.error(res)
        .withStatusCode(401)
        .withMessage(MESSAGE_UNAUTHORIZED)
        .send()
      }

      const resourceOwnerId = req.params[resourceIdParam]
      const userId = req.user._id.toString()
      const userRoles = req.user.roles || []

      // Check if user is owner
      const isOwner = authService.isOwner(userId, resourceOwnerId)
      if (isOwner.granted) {
        return next()
      }

      // Check if user has the required permission
      const hasPermission = await authService.hasPermission(
        userRoles,
        permission,
      )
      if (hasPermission.granted) {
        return next()
      }

      return ResponseBuilder.error(res)
        .withStatusCode(403)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return ResponseBuilder.error(res)
        .withStatusCode(403)
        .withMessage(MESSAGE_INSUFFICIENT_PERMISSIONS)
        .send()
    }
  }
}
