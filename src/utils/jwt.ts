import jwt from 'jsonwebtoken'

export const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  })
}

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '1d',
  })
}
