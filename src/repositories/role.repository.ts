import RoleModel, { IRole } from '../models/role.model'
import { Role, Permission } from '../types/rbac.types'

/**
 * Role Repository
 * Handles all database operations for roles
 * @class
 */
export class RoleRepository {
  /**
   * Find role by name
   * @param {Role} name - The name of the role to find.
   * @returns {Promise<IRole | null>} A promise that resolves to the role if found, or null otherwise.
   */
  async findByName(name: Role): Promise<IRole | null> {
    return await RoleModel.findOne({ name, isActive: true }).exec()
  }

  /**
   * Find multiple roles by names
   * @param {Role[]} names - The names of the roles to find.
   * @returns {Promise<IRole[]>} A promise that resolves to an array of roles.
   */
  async findByNames(names: Role[]): Promise<IRole[]> {
    return await RoleModel.find({ name: { $in: names }, isActive: true }).exec()
  }

  /**
   * Get all active roles
   * @returns {Promise<IRole[]>} A promise that resolves to an array of active roles.
   */
  async findAll(): Promise<IRole[]> {
    return await RoleModel.find({ isActive: true }).exec()
  }

  /**
   * Create a new role
   * @param {Object} roleData - The data for the new role.
   * @param {Role} roleData.name - The name of the role.
   * @param {string} roleData.description - The description of the role.
   * @param {Permission[]} roleData.permissions - The permissions assigned to the role.
   * @returns {Promise<IRole>} A promise that resolves to the created role.
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
   * @param {Role} roleName - The name of the role to update.
   * @param {Permission[]} permissions - The new set of permissions for the role.
   * @returns {Promise<IRole | null>} A promise that resolves to the updated role if found, or null otherwise.
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
   * @param {Role} roleName - The name of the role to update.
   * @param {Permission[]} permissions - The permissions to add to the role.
   * @returns {Promise<IRole | null>} A promise that resolves to the updated role if found, or null otherwise.
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
   * @param {Role} roleName - The name of the role to update.
   * @param {Permission[]} permissions - The permissions to remove from the role.
   * @returns {Promise<IRole | null>} A promise that resolves to the updated role if found, or null otherwise.
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
   * @param {Role} roleName - The name of the role to delete.
   * @returns {Promise<IRole | null>} A promise that resolves to the deleted role if found, or null otherwise.
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
   * @param {Role} roleName - The name of the role.
   * @returns {Promise<Permission[]>} A promise that resolves to an array of permissions.
   */
  async getPermissions(roleName: Role): Promise<Permission[]> {
    const role = await this.findByName(roleName)
    return role ? role.permissions : []
  }

  /**
   * Get permissions for multiple roles
   * @param {Role[]} roles - The names of the roles.
   * @returns {Promise<Permission[]>} A promise that resolves to an array of permissions.
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
   * @param {Role} roleName - The name of the role to check.
   * @returns {Promise<boolean>} A promise that resolves to true if the role exists and is active, false otherwise.
   */
  async exists(roleName: Role): Promise<boolean> {
    const count = await RoleModel.countDocuments({
      name: roleName,
      isActive: true,
    }).exec()
    return count > 0
  }
}
