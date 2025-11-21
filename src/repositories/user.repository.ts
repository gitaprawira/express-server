import User, { IUser } from '../models/user.model'

export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData)
    return await user.save()
  }

  async findAll(): Promise<IUser[]> {
    return await User.find().exec()
  }

  findByEmail(email: string) {
    return User.findOne({ email })
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec()
  }

  findByToken(token: string) {
    return User.findOne({ 'authentication.token': token })
  }

  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).exec()
  }

  async delete(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id).exec()
  }
}
