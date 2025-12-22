import jwt from 'jsonwebtoken'

/**
 * Generate JWT Access Token
 */
export const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  })
}

/**
 * Generate JWT Refresh Token
 */
export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '1d',
  })
}
