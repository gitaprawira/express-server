import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/user.service'
import { HTTP_OK } from '../utils/constans'
import { ResponseBuilder } from '../utils/response-builder'
import { catchAsync } from '../utils/catch-async'

export class UserController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  /**
   * Get All Users
   */
  getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.userService.getAllUsers()

      return ResponseBuilder.success(res)
        .withStatusCode(HTTP_OK)
        .withData(result)
        .send()
    },
  )

  /**
   * Get User by ID
   */
  getUserById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params
      const result = await this.userService.getUserById(id)

      return ResponseBuilder.success(res)
        .withStatusCode(HTTP_OK)
        .withData(result)
        .send()
    },
  )

  /**
   * Delete User
   */
  deleteUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params
      const result = await this.userService.deleteUser(id)

      return ResponseBuilder.success(res)
        .withStatusCode(HTTP_OK)
        .withData(result)
        .send()
    },
  )
}
