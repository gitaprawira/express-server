import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  id: string
  firstname: string
  lastName: string
  username: string
  email: string
  isAdmin: boolean
  authentication: {
    password: string
    salt: string
    token?: string
  }
}

const UserSchema: Schema = new Schema(
  {
    firstname: { type: String, required: false },
    lastName: { type: String, required: false },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, required: false },
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

export default mongoose.model<IUser>('User', UserSchema)
