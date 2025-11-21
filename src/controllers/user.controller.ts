import { Request, Response } from 'express'
import { UserService } from '../services/user.service'
import {
  HTTP_BAD_REQUEST,
  HTTP_FORBIDDEN,
  HTTP_OK,
  MESSAGE_FORBIDDEN,
  MESSAGE_UNEXPECTED_ERROR,
} from '../utils/constans'

export class UserController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  getAllUsers = async (req: Request, res: Response) => {
    const result = await this.userService.getAllUsers()

    if (result) {
      return res
        .json({
          success: true,
          errorMessage: null,
          statusCode: HTTP_OK,
          data: result,
        })
        .end()
    } else {
      return res.json({
        success: false,
        errorMessage: MESSAGE_FORBIDDEN,
        statusCode: HTTP_FORBIDDEN,
      })
    }
  }
  
  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await this.userService.getUserById(id)
    if (result) {
      return res
        .json({
          success: true,
          errorMessage: null,
          statusCode: HTTP_OK,
          data: result,
        })
        .end()
    } else {
      return res.json({
        success: false,
        errorMessage: MESSAGE_FORBIDDEN,
        statusCode: HTTP_FORBIDDEN,
      })
    }
  }

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await this.userService.deleteUser(id)

    if (result) {
      return res
        .json({
          success: true,
          errorMessage: null,
          statusCode: HTTP_OK,
          data: result,
        })
        .end()
    } else {
      return res.json({
        success: false,
        errorMessage: MESSAGE_UNEXPECTED_ERROR,
        statusCode: HTTP_BAD_REQUEST,
      })
    }
  }
}
