import crypto from 'crypto'
import { Role, Permission, IPermissionCheckResult } from '../types/rbac.types'
import { RoleRepository } from '../repositories/role.repository'
import { PermissionRepository } from '../repositories/permission.repository'
import { UserRepository } from '../repositories/user.repository'
import { generateSalt, authentication } from '../utils/encryption'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {
  MESSAGE_ROLE_NOT_FOUND,
  MESSAGE_PERMISSION_NOT_FOUND,
  MESSAGE_INSUFFICIENT_PERMISSIONS,
  MESSAGE_NO_ROLES_ASSIGNED,
  MESSAGE_FORBIDDEN,
  MESSAGE_NOT_FOUND,
  MESSAGE_EMAIL_PASSWORD_REQUIRED,
  MESSAGE_INVALID_INPUT_TYPES,
  MESSAGE_INVALID_CREDENTIALS,
  MESSAGE_EMAIL_USERNAME_PASSWORD_REQUIRED,
  MESSAGE_INVALID_EMAIL_FORMAT,
  MESSAGE_PASSWORD_MIN_LENGTH,
  MESSAGE_USERNAME_MIN_LENGTH,
  MESSAGE_USER_ALREADY_EXISTS,
  MESSAGE_INVALID_REFRESH_TOKEN,
  MESSAGE_LOGOUT_SUCCESS,
  MESSAGE_JWT_REFRESH_SECRET_NOT_CONFIGURED,
  MESSAGE_INVALID_EXPIRED_REFRESH_TOKEN,
  LOG_AUTHORIZATION_ERROR,
  LOG_AUTHENTICATION_ERROR,
  LOG_REGISTRATION_ERROR,
  LOG_SIGNOUT_ERROR,
  LOG_TOKEN_REFRESH_ERROR,
} from '../utils/constans'

export class AuthorizationService {
  private roleRepository: RoleRepository
  private permissionRepository: PermissionRepository
  private userRepository: UserRepository

  constructor(
    roleRepository: RoleRepository,
    permissionRepository: PermissionRepository,
    userRepository: UserRepository,
  ) {
    this.roleRepository = roleRepository
    this.permissionRepository = permissionRepository
    this.userRepository = userRepository
  }

  /**
   * Check if user has a specific permission
   * @param userRoles - Array of roles assigned to the user
   * @param requiredPermission - Permission to check
   * @returns Permission check result
   */
  async hasPermission(
    userRoles: Role[],
    requiredPermission: Permission,
  ): Promise<IPermissionCheckResult> {
    try {
      if (!userRoles || userRoles.length === 0) {
        return {
          granted: false,
          reason: MESSAGE_NO_ROLES_ASSIGNED,
        }
      }

      // Get all permissions for user's roles
      const permissions = await this.roleRepository.getPermissionsForRoles(
        userRoles,
      )

      if (permissions.includes(requiredPermission)) {
        return { granted: true }
      }

      return {
        granted: false,
        reason: MESSAGE_INSUFFICIENT_PERMISSIONS,
      }
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return {
        granted: false,
        reason: MESSAGE_PERMISSION_NOT_FOUND,
      }
    }
  }

  /**
   * Check if user has any of the required permissions
   * @param userRoles - Array of roles assigned to the user
   * @param requiredPermissions - Array of permissions (user needs at least one)
   * @returns Permission check result
   */
  async hasAnyPermission(
    userRoles: Role[],
    requiredPermissions: Permission[],
  ): Promise<IPermissionCheckResult> {
    try {
      if (!userRoles || userRoles.length === 0) {
        return {
          granted: false,
          reason: MESSAGE_NO_ROLES_ASSIGNED,
        }
      }

      const permissions = await this.roleRepository.getPermissionsForRoles(
        userRoles,
      )

      const hasPermission = requiredPermissions.some((permission) =>
        permissions.includes(permission),
      )

      if (hasPermission) {
        return { granted: true }
      }

      return {
        granted: false,
        reason: MESSAGE_INSUFFICIENT_PERMISSIONS,
      }
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return {
        granted: false,
        reason: MESSAGE_PERMISSION_NOT_FOUND,
      }
    }
  }

  /**
   * Check if user has all required permissions
   * @param userRoles - Array of roles assigned to the user
   * @param requiredPermissions - Array of permissions (user needs all)
   * @returns Permission check result
   */
  async hasAllPermissions(
    userRoles: Role[],
    requiredPermissions: Permission[],
  ): Promise<IPermissionCheckResult> {
    try {
      if (!userRoles || userRoles.length === 0) {
        return {
          granted: false,
          reason: MESSAGE_NO_ROLES_ASSIGNED,
        }
      }

      const permissions = await this.roleRepository.getPermissionsForRoles(
        userRoles,
      )

      const hasAllPermissions = requiredPermissions.every((permission) =>
        permissions.includes(permission),
      )

      if (hasAllPermissions) {
        return { granted: true }
      }

      return {
        granted: false,
        reason: MESSAGE_INSUFFICIENT_PERMISSIONS,
      }
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return {
        granted: false,
        reason: MESSAGE_PERMISSION_NOT_FOUND,
      }
    }
  }

  /**
   * Check if user has a specific role
   * @param userRoles - Array of roles assigned to the user
   * @param requiredRole - Role to check
   * @returns Permission check result
   */
  async hasRole(
    userRoles: Role[],
    requiredRole: Role,
  ): Promise<IPermissionCheckResult> {
    try {
      if (!userRoles || userRoles.length === 0) {
        return {
          granted: false,
          reason: MESSAGE_NO_ROLES_ASSIGNED,
        }
      }

      if (userRoles.includes(requiredRole)) {
        return { granted: true }
      }

      return {
        granted: false,
        reason: MESSAGE_ROLE_NOT_FOUND,
      }
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return {
        granted: false,
        reason: MESSAGE_ROLE_NOT_FOUND,
      }
    }
  }

  /**
   * Check if user has any of the required roles
   * @param userRoles - Array of roles assigned to the user
   * @param requiredRoles - Array of roles (user needs at least one)
   * @returns Permission check result
   */
  async hasAnyRole(
    userRoles: Role[],
    requiredRoles: Role[],
  ): Promise<IPermissionCheckResult> {
    try {
      if (!userRoles || userRoles.length === 0) {
        return {
          granted: false,
          reason: MESSAGE_NO_ROLES_ASSIGNED,
        }
      }

      const hasRole = requiredRoles.some((role) => userRoles.includes(role))

      if (hasRole) {
        return { granted: true }
      }

      return {
        granted: false,
        reason: MESSAGE_ROLE_NOT_FOUND,
      }
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return {
        granted: false,
        reason: MESSAGE_ROLE_NOT_FOUND,
      }
    }
  }

  /**
   * Get all permissions for a user based on their roles
   * @param userRoles - Array of roles assigned to the user
   * @returns Array of permissions
   */
  async getUserPermissions(userRoles: Role[]): Promise<Permission[]> {
    try {
      if (!userRoles || userRoles.length === 0) {
        return []
      }

      return await this.roleRepository.getPermissionsForRoles(userRoles)
    } catch (error) {
      console.error(LOG_AUTHORIZATION_ERROR, error)
      return []
    }
  }

  /**
   * Check if user is owner of a resource
   * @param userId - Current user's ID
   * @param resourceOwnerId - Resource owner's ID
   * @returns Permission check result
   */
  isOwner(userId: string, resourceOwnerId: string): IPermissionCheckResult {
    if (userId === resourceOwnerId) {
      return { granted: true }
    }

    return {
      granted: false,
      reason: MESSAGE_INSUFFICIENT_PERMISSIONS,
    }
  }

  /**
   * Authenticate user with email and password
   * @param email - User email
   * @param password - User password
   * @returns User object with access and refresh tokens
   */
  async authenticate(email: string, password: string) {
    try {
      // Input validation
      if (!email || !password) {
        throw new Error(MESSAGE_EMAIL_PASSWORD_REQUIRED)
      }

      if (typeof email !== 'string' || typeof password !== 'string') {
        throw new Error(MESSAGE_INVALID_INPUT_TYPES)
      }

      // Normalize email
      const normalizedEmail = email.toLowerCase().trim()

      // Find user with authentication fields
      const user = await this.userRepository
        .findByEmail(normalizedEmail)
        .select('+authentication.salt +authentication.password')
        .exec()

      if (!user) {
        throw new Error(MESSAGE_INVALID_CREDENTIALS)
      }

      // Verify password using timing-safe comparison
      const expectedHash = authentication(user.authentication.salt, password)

      // Use crypto.timingSafeEqual for timing attack prevention
      const expectedBuffer = Buffer.from(expectedHash, 'utf8')
      const actualBuffer = Buffer.from(user.authentication.password, 'utf8')

      if (
        expectedBuffer.length !== actualBuffer.length ||
        !crypto.timingSafeEqual(
          Uint8Array.from(expectedBuffer),
          Uint8Array.from(actualBuffer),
        )
      ) {
        throw new Error(MESSAGE_INVALID_CREDENTIALS)
      }

      // Generate tokens
      const accessToken = generateAccessToken(user._id.toString())
      const refreshToken = generateRefreshToken(user._id.toString())

      // Save refresh token to the database
      user.authentication.token = refreshToken
      await user.save()

      // Remove sensitive data from response
      const userObject = user.toObject()
      delete userObject.authentication

      return { user: userObject, accessToken, refreshToken }
    } catch (error) {
      console.error(LOG_AUTHENTICATION_ERROR, error)
    }
  }

  /**
   * Register a new user
   * @param email - User email
   * @param password - User password
   * @param username - Username
   * @param firstname - First name
   * @param lastName - Last name
   * @param image - Profile image URL (optional)
   * @param roles - User roles (optional)
   * @returns Created user object
   */
  async register(
    email: string,
    password: string,
    username: string,
    firstname: string,
    lastName: string,
    image?: string,
    roles?: Role[],
  ) {
    try {
      // Input validation
      if (!email || !password || !username) {
        throw new Error(MESSAGE_EMAIL_USERNAME_PASSWORD_REQUIRED)
      }

      if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        typeof username !== 'string'
      ) {
        throw new Error(MESSAGE_INVALID_INPUT_TYPES)
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error(MESSAGE_INVALID_EMAIL_FORMAT)
      }

      // Validate password strength
      if (password.length < 8) {
        throw new Error(MESSAGE_PASSWORD_MIN_LENGTH)
      }

      // Validate username
      if (username.length < 3) {
        throw new Error(MESSAGE_USERNAME_MIN_LENGTH)
      }

      // Normalize email
      const normalizedEmail = email.toLowerCase().trim()

      // Check if user already exists
      const existingUser = await this.userRepository
        .findByEmail(normalizedEmail)
        .exec()
      if (existingUser) {
        throw new Error(MESSAGE_USER_ALREADY_EXISTS)
      }

      // Hash password
      const salt = generateSalt()
      const hashedPassword = authentication(salt, password)

      // Determine user roles
      let userRoles: Role[] = roles || [Role.USER]

      // Create user
      const newUser = await this.userRepository.create({
        firstname: firstname?.trim(),
        lastName: lastName?.trim(),
        username: username.trim(),
        email: normalizedEmail,
        image: image?.trim(),
        roles: userRoles,
        authentication: {
          salt,
          password: hashedPassword,
        },
      })

      // Remove sensitive data from response
      const userObject = newUser.toObject()
      delete userObject.authentication

      return userObject
    } catch (error) {
      console.error(LOG_REGISTRATION_ERROR, error)
    }
  }

  /**
   * Sign out user and invalidate refresh token
   * @param refreshToken - User's refresh token
   * @returns Success message
   */
  async signOut(refreshToken: string) {
    try {
      // Input validation
      if (!refreshToken || typeof refreshToken !== 'string') {
        throw new Error(MESSAGE_INVALID_REFRESH_TOKEN)
      }

      // Find user by token
      const user = await this.userRepository
        .findByToken(refreshToken)
        .select('+authentication.token')
        .exec()

      if (!user) {
        throw new Error(MESSAGE_NOT_FOUND)
      }

      // Clear refresh token
      user.authentication.token = undefined
      await user.save()

      return { success: true, message: MESSAGE_LOGOUT_SUCCESS }
    } catch (error) {
      console.error(LOG_SIGNOUT_ERROR, error)
    }
  }

  /**
   * Refresh access token using refresh token
   * @param incomingRefreshToken - Refresh token
   * @returns New access token
   */
  async tokenRefresh(incomingRefreshToken: string) {
    try {
      // Input validation
      if (!incomingRefreshToken || typeof incomingRefreshToken !== 'string') {
        throw new Error(MESSAGE_INVALID_REFRESH_TOKEN)
      }

      // Verify environment variable exists
      if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error(MESSAGE_JWT_REFRESH_SECRET_NOT_CONFIGURED)
      }

      // Verify token
      const decoded = jwt.verify(
        incomingRefreshToken,
        process.env.JWT_REFRESH_SECRET,
      ) as JwtPayload

      // Find user by token
      const user = await this.userRepository
        .findByToken(incomingRefreshToken)
        .select('+authentication.token')
        .exec()

      if (!user) {
        throw new Error(MESSAGE_NOT_FOUND)
      }

      // Verify token belongs to user
      if (user._id.toString() !== decoded.id) {
        throw new Error(MESSAGE_FORBIDDEN)
      }

      // Generate new access token
      const accessToken = generateAccessToken(user._id.toString())

      return { accessToken }
    } catch (error) {
      console.error(LOG_TOKEN_REFRESH_ERROR, error)
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error(MESSAGE_INVALID_EXPIRED_REFRESH_TOKEN)
      }
    }
  }
}
