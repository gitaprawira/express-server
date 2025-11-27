import { UserRepository } from "../repositories/user.repository"
import {
  MESSAGE_FAILED_TO_FETCH_USER,
  HTTP_NOT_FOUND,
} from '../utils/constans'
import { AppError } from '../utils/app-error'

export class UserService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  /**
   * Get all users
   */
  async getAllUsers() {
    return await this.userRepository.findAll()
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new AppError(MESSAGE_FAILED_TO_FETCH_USER, HTTP_NOT_FOUND)
    }
    return user
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: string) {
    const user = await this.userRepository.delete(id)
    if (!user) {
      throw new AppError(MESSAGE_FAILED_TO_FETCH_USER, HTTP_NOT_FOUND)
    }
    return user
  }
}
