import mongoose, { Schema, Document } from 'mongoose'
import { Role } from '../types/rbac.types'

/**
 * Interface for User Document
 * Following Interface Segregation Principle
 */
export interface IUser extends Document {
  id: string
  firstname: string
  lastName: string
  username: string
  email: string
  image?: string
  roles: Role[]
  authentication: {
    password: string
    salt: string
    token?: string
  }
}

/**
 * User Schema
 * Manages user data and authentication details
 */
const UserSchema: Schema = new Schema(
  {
    firstname: { type: String, required: false },
    lastName: { type: String, required: false },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: false },
    roles: {
      type: [String],
      enum: Object.values(Role),
      default: [Role.USER],
    },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      token: { type: String, select: false },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
)

// Index for faster role-based queries
UserSchema.index({ roles: 1 })

export default mongoose.model<IUser>('User', UserSchema)
