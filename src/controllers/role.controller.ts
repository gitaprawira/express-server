import { Request, Response, NextFunction } from 'express'
import { RoleService } from '../services/role.service'
import {
  HTTP_OK,
  HTTP_CREATED,
  MESSAGE_ROLE_DELETED_SUCCESS,
} from '../utils/constans'
import { catchAsync } from '../utils/catch-async'
import { ResponseBuilder } from '../utils/response-builder'

export class RoleController {
  private roleService: RoleService

  constructor(roleService: RoleService) {
    this.roleService = roleService
  }

  /**
   * Get All Roles
   */
  getAllRoles = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const roles = await this.roleService.getAllRoles()

      return ResponseBuilder.success(res)
        .withStatusCode(HTTP_OK)
        .withData(roles)
        .send()
    },
  )

  /**
   * Get Role by Name
   */
  getRoleByName = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name } = req.params
      const role = await this.roleService.getRoleByName(name as any)

      return ResponseBuilder.success(res)
        .withStatusCode(HTTP_OK)
        .withData(role)
        .send()
    },
  )

  /**
   * Create a New Role
   */
  createRole = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, description, permissions } = req.body
      const role = await this.roleService.createRole(
        name,
        description,
        permissions,
      )

      return ResponseBuilder.success(res)
        .withStatusCode(HTTP_CREATED)
        .withData(role)
        .send()
    },
  )

  /**
   * Update Role Permissions
   */
  updateRolePermissions = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name } = req.params
      const { permissions } = req.body
      const role = await this.roleService.updateRolePermissions(
        name as any,
        permissions,
      )

      return ResponseBuilder.success(res)
        .withStatusCode(HTTP_OK)
        .withData(role)
        .send()
    },
  )

  /**
   * Add Permissions to Role
   */
  addPermissions = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name } = req.params
      const { permissions } = req.body
      const role = await this.roleService.addPermissionsToRole(
        name as any,
        permissions,
      )

      return ResponseBuilder.success(res)
        .withStatusCode(HTTP_OK)
        .withData(role)
        .send()
    },
  )

  /**
   * Remove Permissions from Role
   */
  removePermissions = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name } = req.params
      const { permissions } = req.body
      const role = await this.roleService.removePermissionsFromRole(
        name as any,
        permissions,
      )

      return ResponseBuilder.success(res)
        .withStatusCode(HTTP_OK)
        .withData(role)
        .send()
    },
  )

  /**
   * Delete Role
   */
  deleteRole = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name } = req.params
      await this.roleService.deleteRole(name as any)

      return ResponseBuilder.success(res)
        .withStatusCode(HTTP_OK)
        .withData({ message: MESSAGE_ROLE_DELETED_SUCCESS })
        .send()
    },
  )
}
