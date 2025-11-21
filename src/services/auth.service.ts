import crypto from 'crypto'
import { UserRepository } from '../repositories/user.repository'
import { generateSalt, authentication } from '../utils/encryption'
import {
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
  LOG_AUTHENTICATION_ERROR,
  LOG_REGISTRATION_ERROR,
  LOG_SIGNOUT_ERROR,
  LOG_TOKEN_REFRESH_ERROR,
} from '../utils/constans'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import jwt, { JwtPayload } from 'jsonwebtoken'

export class AuthService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

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
      throw error
    }
  }

  async register(
    email: string,
    password: string,
    username: string,
    firstname: string,
    lastName: string,
    isAdmin: boolean = false,
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

      // Create user
      const newUser = await this.userRepository.create({
        firstname: firstname?.trim(),
        lastName: lastName?.trim(),
        username: username.trim(),
        email: normalizedEmail,
        isAdmin,
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
      throw error
    }
  }

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
      throw error
    }
  }

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
      throw error
    }
  }
}
