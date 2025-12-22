import { RoleRepository } from '../repositories/role.repository'
import { Role, Permission } from '../types/rbac.types'
import {
  MESSAGE_ROLE_NOT_FOUND,
  MESSAGE_ROLE_ALREADY_EXISTS,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
} from '../utils/constans'
import { AppError } from '../utils/app-error'

export class RoleService {
  private roleRepository: RoleRepository

  constructor(roleRepository: RoleRepository) {
    this.roleRepository = roleRepository
  }

  /**
   * Get all roles
   */
  async getAllRoles() {
    return await this.roleRepository.findAll()
  }

  /**
   * Get role by name
   */
  async getRoleByName(name: Role) {
    const role = await this.roleRepository.findByName(name)
    if (!role) {
      throw new AppError(MESSAGE_ROLE_NOT_FOUND, HTTP_NOT_FOUND)
    }
    return role
  }

  /**
   * Create a new role
   */
  async createRole(name: Role, description: string, permissions: Permission[]) {
    const existingRole = await this.roleRepository.findByName(name)
    if (existingRole) {
      throw new AppError(MESSAGE_ROLE_ALREADY_EXISTS, HTTP_BAD_REQUEST)
    }

    return await this.roleRepository.create({
      name,
      description,
      permissions,
    })
  }

  /**
   * Update role permissions
   */
  async updateRolePermissions(name: Role, permissions: Permission[]) {
    const role = await this.roleRepository.updatePermissions(name, permissions)
    if (!role) {
      throw new AppError(MESSAGE_ROLE_NOT_FOUND, HTTP_NOT_FOUND)
    }
    return role
  }

  /**
   * Add permissions to role
   */
  async addPermissionsToRole(name: Role, permissions: Permission[]) {
    const role = await this.roleRepository.addPermissions(name, permissions)
    if (!role) {
      throw new AppError(MESSAGE_ROLE_NOT_FOUND, HTTP_NOT_FOUND)
    }
    return role
  }

  /**
   * Remove permissions from role
   */
  async removePermissionsFromRole(name: Role, permissions: Permission[]) {
    const role = await this.roleRepository.removePermissions(name, permissions)
    if (!role) {
      throw new AppError(MESSAGE_ROLE_NOT_FOUND, HTTP_NOT_FOUND)
    }
    return role
  }

  /**
   * Get permissions for a role
   */
  async getRolePermissions(name: Role) {
    return await this.roleRepository.getPermissions(name)
  }

  /**
   * Delete a role
   */
  async deleteRole(name: Role) {
    const role = await this.roleRepository.delete(name)
    if (!role) {
      throw new AppError(MESSAGE_ROLE_NOT_FOUND, HTTP_NOT_FOUND)
    }
    return role
  }
}
