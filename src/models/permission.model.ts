import mongoose, { Schema, Document } from 'mongoose'
import { Permission, Resource, Action } from '../types/rbac.types'

/**
 * Interface for Permission Document
 * Following Interface Segregation Principle
 */
export interface IPermission extends Document {
  name: Permission
  resource: Resource
  action: Action
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Permission Schema
 * Manages granular permission definitions
 */
const PermissionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(Permission),
      index: true,
    },
    resource: {
      type: String,
      required: true,
      enum: Object.values(Resource),
    },
    action: {
      type: String,
      required: true,
      enum: Object.values(Action),
    },
    description: {
      type: String,
      required: true,
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

// Compound index for faster queries
PermissionSchema.index({ resource: 1, action: 1 })
PermissionSchema.index({ name: 1, isActive: 1 })

export default mongoose.model<IPermission>('Permission', PermissionSchema)
