import crypto from 'crypto'
import { Role } from '../types/rbac.types'
import { RoleRepository } from '../repositories/role.repository'
import { UserRepository } from '../repositories/user.repository'
import { generateSalt, authentication } from '../utils/encryption'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {
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
  MESSAGE_FORBIDDEN,
  MESSAGE_NOT_FOUND,
  HTTP_BAD_REQUEST,
  HTTP_UNAUTHORIZED,
  HTTP_FORBIDDEN,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
} from '../utils/constans'
import { AppError } from '../utils/app-error'

export interface RegisterInput {
  email: string
  password: string
  username: string
  firstName?: string
  lastName?: string
  image?: string
  roles?: Role[]
}

export class AuthService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async authenticate(email: string, password: string) {
    if (!email || !password) {
      throw new AppError(MESSAGE_EMAIL_PASSWORD_REQUIRED, HTTP_BAD_REQUEST)
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new AppError(MESSAGE_INVALID_INPUT_TYPES, HTTP_BAD_REQUEST)
    }

    const normalizedEmail = email.toLowerCase().trim()

    const user = await this.userRepository
      .findByEmail(normalizedEmail)
      .select('+authentication.salt +authentication.password')
      .exec()

    if (!user) {
      throw new AppError(MESSAGE_INVALID_CREDENTIALS, HTTP_UNAUTHORIZED)
    }

    const expectedHash = authentication(user.authentication.salt, password)
    const expectedBuffer = Buffer.from(expectedHash, 'utf8')
    const actualBuffer = Buffer.from(user.authentication.password, 'utf8')

    if (
      expectedBuffer.length !== actualBuffer.length ||
      !crypto.timingSafeEqual(
        Uint8Array.from(expectedBuffer),
        Uint8Array.from(actualBuffer),
      )
    ) {
      throw new AppError(MESSAGE_INVALID_CREDENTIALS, HTTP_UNAUTHORIZED)
    }

    const accessToken = generateAccessToken(user._id.toString())
    const refreshToken = generateRefreshToken(user._id.toString())

    user.authentication.token = refreshToken
    await user.save()

    const { authentication: authenticationData, ...userObject } =
      user.toObject()

    return { user: userObject, accessToken, refreshToken }
  }

  async register(input: RegisterInput) {
    const { email, password, username, firstName, lastName, image, roles } =
      input

    if (!email || !password || !username) {
      throw new AppError(
        MESSAGE_EMAIL_USERNAME_PASSWORD_REQUIRED,
        HTTP_BAD_REQUEST,
      )
    }

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof username !== 'string'
    ) {
      throw new AppError(MESSAGE_INVALID_INPUT_TYPES, HTTP_BAD_REQUEST)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new AppError(MESSAGE_INVALID_EMAIL_FORMAT, HTTP_BAD_REQUEST)
    }

    if (password.length < 8) {
      throw new AppError(MESSAGE_PASSWORD_MIN_LENGTH, HTTP_BAD_REQUEST)
    }

    if (username.length < 3) {
      throw new AppError(MESSAGE_USERNAME_MIN_LENGTH, HTTP_BAD_REQUEST)
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existingUser = await this.userRepository
      .findByEmail(normalizedEmail)
      .exec()
    if (existingUser) {
      throw new AppError(MESSAGE_USER_ALREADY_EXISTS, HTTP_BAD_REQUEST)
    }

    const salt = generateSalt()
    const hashedPassword = authentication(salt, password)

    const userRoles: Role[] = roles ?? [Role.USER]

    const newUser = await this.userRepository.create({
      firstName: firstName?.trim(),
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

    const userObject = newUser.toObject()
    delete userObject.authentication

    return userObject
  }

  async signOut(refreshToken: string) {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new AppError(MESSAGE_INVALID_REFRESH_TOKEN, HTTP_BAD_REQUEST)
    }

    const user = await this.userRepository
      .findByToken(refreshToken)
      .select('+authentication.token')
      .exec()

    // Silently succeed if token is already gone — the user is effectively signed out
    if (user) {
      user.authentication.token = undefined
      await user.save()
    }

    return { success: true, message: MESSAGE_LOGOUT_SUCCESS }
  }

  async tokenRefresh(incomingRefreshToken: string) {
    if (!incomingRefreshToken || typeof incomingRefreshToken !== 'string') {
      throw new AppError(MESSAGE_INVALID_REFRESH_TOKEN, HTTP_BAD_REQUEST)
    }

    if (!process.env.JWT_REFRESH_SECRET) {
      throw new AppError(
        MESSAGE_JWT_REFRESH_SECRET_NOT_CONFIGURED,
        HTTP_INTERNAL_SERVER_ERROR,
      )
    }

    try {
      const decoded = jwt.verify(
        incomingRefreshToken,
        process.env.JWT_REFRESH_SECRET,
      ) as JwtPayload

      const user = await this.userRepository
        .findByToken(incomingRefreshToken)
        .select('+authentication.token')
        .exec()

      if (!user) {
        throw new AppError(MESSAGE_NOT_FOUND, HTTP_NOT_FOUND)
      }

      if (user._id.toString() !== decoded.id) {
        throw new AppError(MESSAGE_FORBIDDEN, HTTP_FORBIDDEN)
      }

      const accessToken = generateAccessToken(user._id.toString())
      const refreshToken = generateRefreshToken(user._id.toString())

      user.authentication.token = refreshToken
      await user.save()

      return { accessToken, refreshToken }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError(
          MESSAGE_INVALID_EXPIRED_REFRESH_TOKEN,
          HTTP_UNAUTHORIZED,
        )
      }
      throw error
    }
  }
}
