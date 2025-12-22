import mongoose, { Schema, Document } from 'mongoose'
import { Role, Permission } from '../types/rbac.types'

/**
 * Interface for Role Document
 * Following Interface Segregation Principle
 */
export interface IRole extends Document {
  name: Role
  description: string
  permissions: Permission[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Role Schema
 * Manages role definitions and their associated permissions
 */
const RoleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(Role),
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(Permission),
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id
        delete ret.__v
        return ret
      },
    },
    toObject: {
      virtuals: true,
    },
  },
)

// Index for faster queries
RoleSchema.index({ name: 1, isActive: 1 })

export default mongoose.model<IRole>('Role', RoleSchema)
