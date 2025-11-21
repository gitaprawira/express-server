import { UserRepository } from "../repositories/user.repository"

export class UserService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async getAllUsers() {
    try {
      return await this.userRepository.findAll()
    }
    catch (error) {
      console.error('Error fetching users:', error)
      throw new Error('Failed to fetch users')
    }
  }

  async getUserById(id: string) {
    try {
      return await this.userRepository.findById(id)
    }
    catch (error) {
      console.error(`Error fetching user with id ${id}:`, error)
      throw new Error('Failed to fetch user')
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.userRepository.delete(id)
    }
    catch (error) {
      console.error(`Error deleting user with id ${id}:`, error)
      throw new Error('Failed to delete user')
    }
  }
}
