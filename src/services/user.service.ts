import { UserRepository } from "../repositories/user.repository"
import {
  MESSAGE_FAILED_TO_FETCH_USERS,
  MESSAGE_FAILED_TO_FETCH_USER,
  MESSAGE_FAILED_TO_DELETE_USER,
  LOG_ERROR_FETCHING_USERS,
  LOG_ERROR_FETCHING_USER,
  LOG_ERROR_DELETING_USER,
} from '../utils/constans'

export class UserService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  /**
   * Get all users
   */
  async getAllUsers() {
    try {
      return await this.userRepository.findAll()
    }
    catch (error) {
      console.error(LOG_ERROR_FETCHING_USERS, error)
      throw new Error(MESSAGE_FAILED_TO_FETCH_USERS)
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    try {
      return await this.userRepository.findById(id)
    }
    catch (error) {
      console.error(`${LOG_ERROR_FETCHING_USER} ${id}:`, error)
      throw new Error(MESSAGE_FAILED_TO_FETCH_USER)
    }
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: string) {
    try {
      return await this.userRepository.delete(id)
    }
    catch (error) {
      console.error(`${LOG_ERROR_DELETING_USER} ${id}:`, error)
      throw new Error(MESSAGE_FAILED_TO_DELETE_USER)
    }
  }
}
