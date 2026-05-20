import jwt from 'jsonwebtoken'

export const generateAccessToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' })
}

export const generateRefreshToken = (id: string): string => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not configured')
  }
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' })
}
