import User, { IUser } from '../models/user.model'

/**
 * Repository class for managing User entities in the database.
 * Provides methods for creating, retrieving, updating, and deleting users.
 * @class
 */
export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData)
    return await user.save()
  }

  /**
   * Retrieves all users from the database.
   * @returns {Promise<IUser[]>} A promise that resolves to an array of IUser objects.
   */
  async findAll(): Promise<IUser[]> {
    return await User.find().exec()
  }

  /**
   * Finds a user by their email address.
   * @param {string} email - The email of the user to find.
   */
  findByEmail(email: string) {
    return User.findOne({ email })
  }

  /**
   * Finds a user by their unique identifier.
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<IUser | null>} A promise that resolves to the user if found, or null otherwise.
   */
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec()
  }

  /**
   * Finds a user by their authentication token.
   * @param {string} token - The authentication token of the user to find.
   */
  findByToken(token: string) {
    return User.findOne({ 'authentication.token': token })
  }

  /**
   * Updates a user by their unique identifier.
   * @param {string} id - The ID of the user to update.
   * @param {Partial<IUser>} updateData - The data to update the user with.
   * @returns {Promise<IUser | null>} A promise that resolves to the updated user if found, or null otherwise.
   */
  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).exec()
  }

  /**
   * Deletes a user by their unique identifier.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<IUser | null>} A promise that resolves to the deleted user if found, or null otherwise.
   */
  async delete(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id).exec()
  }
}
