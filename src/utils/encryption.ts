import crypto from 'crypto'

export const generateSalt = () => crypto.randomBytes(128).toString('base64')
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac('sha256', [salt, password].join('/'))
    .update(process.env.PWD_SECRET)
    .digest('hex')
}
