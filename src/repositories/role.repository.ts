import RoleModel, { IRole } from '../models/role.model'
import { Role, Permission } from '../types/rbac.types'

/**
 * Role Repository
 * Following Repository Pattern and Single Responsibility Principle
 * Handles all database operations for roles
 */
export class RoleRepository {
  /**
   * Find role by name
   */
  async findByName(name: Role): Promise<IRole | null> {
    return await RoleModel.findOne({ name, isActive: true }).exec()
  }

  /**
   * Find multiple roles by names
   */
  async findByNames(names: Role[]): Promise<IRole[]> {
    return await RoleModel.find({ name: { $in: names }, isActive: true }).exec()
  }

  /**
   * Get all active roles
   */
  async findAll(): Promise<IRole[]> {
    return await RoleModel.find({ isActive: true }).exec()
  }

  /**
   * Create a new role
   */
  async create(roleData: {
    name: Role
    description: string
    permissions: Permission[]
  }): Promise<IRole> {
    const role = new RoleModel(roleData)
    return await role.save()
  }

  /**
   * Update role permissions
   */
  async updatePermissions(
    roleName: Role,
    permissions: Permission[],
  ): Promise<IRole | null> {
    return await RoleModel.findOneAndUpdate(
      { name: roleName },
      { permissions },
      { new: true },
    ).exec()
  }

  /**
   * Add permissions to a role
   */
  async addPermissions(
    roleName: Role,
    permissions: Permission[],
  ): Promise<IRole | null> {
    return await RoleModel.findOneAndUpdate(
      { name: roleName },
      { $addToSet: { permissions: { $each: permissions } } },
      { new: true },
    ).exec()
  }

  /**
   * Remove permissions from a role
   */
  async removePermissions(
    roleName: Role,
    permissions: Permission[],
  ): Promise<IRole | null> {
    return await RoleModel.findOneAndUpdate(
      { name: roleName },
      { $pull: { permissions: { $in: permissions } } },
      { new: true },
    ).exec()
  }

  /**
   * Delete a role (soft delete)
   */
  async delete(roleName: Role): Promise<IRole | null> {
    return await RoleModel.findOneAndUpdate(
      { name: roleName },
      { isActive: false },
      { new: true },
    ).exec()
  }

  /**
   * Get permissions for a specific role
   */
  async getPermissions(roleName: Role): Promise<Permission[]> {
    const role = await this.findByName(roleName)
    return role ? role.permissions : []
  }

  /**
   * Get permissions for multiple roles
   */
  async getPermissionsForRoles(roles: Role[]): Promise<Permission[]> {
    const roleDocuments = await this.findByNames(roles)
    const permissions = new Set<Permission>()
    
    roleDocuments.forEach((role) => {
      role.permissions.forEach((permission) => permissions.add(permission))
    })
    
    return Array.from(permissions)
  }

  /**
   * Check if a role exists
   */
  async exists(roleName: Role): Promise<boolean> {
    const count = await RoleModel.countDocuments({
      name: roleName,
      isActive: true,
    }).exec()
    return count > 0
  }
}
