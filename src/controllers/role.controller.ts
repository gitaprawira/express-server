import { Request, Response } from 'express'
import { RoleService } from '../services/role.service'
import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  MESSAGE_NOT_FOUND,
  MESSAGE_UNEXPECTED_ERROR,
  MESSAGE_ROLE_DELETED_SUCCESS,
} from '../utils/constans'

export class RoleController {
  private roleService: RoleService

  constructor(roleService: RoleService) {
    this.roleService = roleService
  }

  /**
   * Get All Roles
   */
  getAllRoles = async (req: Request, res: Response) => {
    try {
      const roles = await this.roleService.getAllRoles()
      return res.status(HTTP_OK).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_OK,
        data: roles,
      })
    } catch (error) {
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        errorMessage: MESSAGE_UNEXPECTED_ERROR,
        statusCode: HTTP_BAD_REQUEST,
      })
    }
  }

  /**
   * Get Role by Name
   */
  getRoleByName = async (req: Request, res: Response) => {
    try {
      const { name } = req.params
      const role = await this.roleService.getRoleByName(name as any)
      return res.status(HTTP_OK).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_OK,
        data: role,
      })
    } catch (error) {
      return res.status(HTTP_NOT_FOUND).json({
        success: false,
        errorMessage: MESSAGE_NOT_FOUND,
        statusCode: HTTP_NOT_FOUND,
      })
    }
  }

  /**
   * Create a New Role
   */
  createRole = async (req: Request, res: Response) => {
    try {
      const { name, description, permissions } = req.body
      const role = await this.roleService.createRole(
        name,
        description,
        permissions,
      )
      return res.status(HTTP_CREATED).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_CREATED,
        data: role,
      })
    } catch (error) {
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        errorMessage:
          error instanceof Error ? error.message : MESSAGE_UNEXPECTED_ERROR,
        statusCode: HTTP_BAD_REQUEST,
      })
    }
  }

  /**
   * Update Role Permissions
   */
  updateRolePermissions = async (req: Request, res: Response) => {
    try {
      const { name } = req.params
      const { permissions } = req.body
      const role = await this.roleService.updateRolePermissions(
        name as any,
        permissions,
      )
      return res.status(HTTP_OK).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_OK,
        data: role,
      })
    } catch (error) {
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        errorMessage:
          error instanceof Error ? error.message : MESSAGE_UNEXPECTED_ERROR,
        statusCode: HTTP_BAD_REQUEST,
      })
    }
  }

  /**
   * Add Permissions to Role
   */
  addPermissions = async (req: Request, res: Response) => {
    try {
      const { name } = req.params
      const { permissions } = req.body
      const role = await this.roleService.addPermissionsToRole(
        name as any,
        permissions,
      )
      return res.status(HTTP_OK).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_OK,
        data: role,
      })
    } catch (error) {
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        errorMessage:
          error instanceof Error ? error.message : MESSAGE_UNEXPECTED_ERROR,
        statusCode: HTTP_BAD_REQUEST,
      })
    }
  }

  /**
   * Remove Permissions from Role
   */
  removePermissions = async (req: Request, res: Response) => {
    try {
      const { name } = req.params
      const { permissions } = req.body
      const role = await this.roleService.removePermissionsFromRole(
        name as any,
        permissions,
      )
      return res.status(HTTP_OK).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_OK,
        data: role,
      })
    } catch (error) {
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        errorMessage:
          error instanceof Error ? error.message : MESSAGE_UNEXPECTED_ERROR,
        statusCode: HTTP_BAD_REQUEST,
      })
    }
  }

  /**
   * Delete Role
   */
  deleteRole = async (req: Request, res: Response) => {
    try {
      const { name } = req.params
      await this.roleService.deleteRole(name as any)
      return res.status(HTTP_OK).json({
        success: true,
        errorMessage: null,
        statusCode: HTTP_OK,
        data: { message: MESSAGE_ROLE_DELETED_SUCCESS },
      })
    } catch (error) {
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        errorMessage:
          error instanceof Error ? error.message : MESSAGE_UNEXPECTED_ERROR,
        statusCode: HTTP_BAD_REQUEST,
      })
    }
  }
}
