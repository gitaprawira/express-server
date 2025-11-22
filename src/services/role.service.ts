import { RoleRepository } from '../repositories/role.repository'
import { Role, Permission } from '../types/rbac.types'
import {
  MESSAGE_ROLE_NOT_FOUND,
  MESSAGE_ROLE_ALREADY_EXISTS,
  LOG_RBAC_ERROR,
} from '../utils/constans'

export class RoleService {
  private roleRepository: RoleRepository

  constructor(roleRepository: RoleRepository) {
    this.roleRepository = roleRepository
  }

  /**
   * Get all roles
   */
  async getAllRoles() {
    try {
      return await this.roleRepository.findAll()
    } catch (error) {
      console.error(LOG_RBAC_ERROR, error)
    }
  }

  /**
   * Get role by name
   */
  async getRoleByName(name: Role) {
    try {
      const role = await this.roleRepository.findByName(name)
      if (!role) {
        throw new Error(MESSAGE_ROLE_NOT_FOUND)
      }
      return role
    } catch (error) {
      console.error(LOG_RBAC_ERROR, error)
    }
  }

  /**
   * Create a new role
   */
  async createRole(
    name: Role,
    description: string,
    permissions: Permission[],
  ) {
    try {
      const existingRole = await this.roleRepository.findByName(name)
      if (existingRole) {
        throw new Error(MESSAGE_ROLE_ALREADY_EXISTS)
      }

      return await this.roleRepository.create({
        name,
        description,
        permissions,
      })
    } catch (error) {
      console.error(LOG_RBAC_ERROR, error)
    }
  }

  /**
   * Update role permissions
   */
  async updateRolePermissions(name: Role, permissions: Permission[]) {
    try {
      const role = await this.roleRepository.updatePermissions(name, permissions)
      if (!role) {
        throw new Error(MESSAGE_ROLE_NOT_FOUND)
      }
      return role
    } catch (error) {
      console.error(LOG_RBAC_ERROR, error)
    }
  }

  /**
   * Add permissions to role
   */
  async addPermissionsToRole(name: Role, permissions: Permission[]) {
    try {
      const role = await this.roleRepository.addPermissions(name, permissions)
      if (!role) {
        throw new Error(MESSAGE_ROLE_NOT_FOUND)
      }
      return role
    } catch (error) {
      console.error(LOG_RBAC_ERROR, error)
    }
  }

  /**
   * Remove permissions from role
   */
  async removePermissionsFromRole(name: Role, permissions: Permission[]) {
    try {
      const role = await this.roleRepository.removePermissions(name, permissions)
      if (!role) {
        throw new Error(MESSAGE_ROLE_NOT_FOUND)
      }
      return role
    } catch (error) {
      console.error(LOG_RBAC_ERROR, error)
    }
  }

  /**
   * Get permissions for a role
   */
  async getRolePermissions(name: Role) {
    try {
      return await this.roleRepository.getPermissions(name)
    } catch (error) {
      console.error(LOG_RBAC_ERROR, error)
    }
  }

  /**
   * Delete a role
   */
  async deleteRole(name: Role) {
    try {
      const role = await this.roleRepository.delete(name)
      if (!role) {
        throw new Error(MESSAGE_ROLE_NOT_FOUND)
      }
      return role
    } catch (error) {
      console.error(LOG_RBAC_ERROR, error)
    }
  }
}
