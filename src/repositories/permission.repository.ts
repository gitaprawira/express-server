import PermissionModel, { IPermission } from '../models/permission.model'
import { Permission, Resource, Action } from '../types/rbac.types'

/**
 * Permission Repository
 * Handles all database operations for permissions
 * @category Repositories
 */
export class PermissionRepository {
  /**
   * Find permission by name
   * @param {Permission} name - The name of the permission to find.
   * @returns {Promise<IPermission | null>} A promise that resolves to the permission if found, or null otherwise.
   */
  async findByName(name: Permission): Promise<IPermission | null> {
    return await PermissionModel.findOne({ name, isActive: true }).exec()
  }

  /**
   * Find multiple permissions by names
   * @param {Permission[]} names - The names of the permissions to find.
   * @returns {Promise<IPermission[]>} A promise that resolves to an array of permissions.
   */
  async findByNames(names: Permission[]): Promise<IPermission[]> {
    return await PermissionModel.find({
      name: { $in: names },
      isActive: true,
    }).exec()
  }

  /**
   * Find permissions by resource
   * @param {Resource} resource - The resource to find permissions for.
   * @returns {Promise<IPermission[]>} A promise that resolves to an array of permissions.
   */
  async findByResource(resource: Resource): Promise<IPermission[]> {
    return await PermissionModel.find({ resource, isActive: true }).exec()
  }

  /**
   * Find permissions by resource and action
   * @param {Resource} resource - The resource to find permissions for.
   * @param {Action} action - The action to find permissions for.
   * @returns {Promise<IPermission | null>} A promise that resolves to the permission if found, or null otherwise.
   */
  async findByResourceAndAction(
    resource: Resource,
    action: Action,
  ): Promise<IPermission | null> {
    return await PermissionModel.findOne({
      resource,
      action,
      isActive: true,
    }).exec()
  }

  /**
   * Get all active permissions
   * @returns {Promise<IPermission[]>} A promise that resolves to an array of active permissions.
   */
  async findAll(): Promise<IPermission[]> {
    return await PermissionModel.find({ isActive: true }).exec()
  }

  /**
   * Create a new permission
   * @param {Object} permissionData - The data for the new permission.
   * @param {Permission} permissionData.name - The name of the permission.
   * @param {Resource} permissionData.resource - The resource the permission applies to.
   * @param {Action} permissionData.action - The action the permission allows.
   * @param {string} permissionData.description - The description of the permission.
   * @returns {Promise<IPermission>} A promise that resolves to the created permission.
   */
  async create(permissionData: {
    name: Permission
    resource: Resource
    action: Action
    description: string
  }): Promise<IPermission> {
    const permission = new PermissionModel(permissionData)
    return await permission.save()
  }

  /**
   * Update permission
   * @param {Permission} name - The name of the permission to update.
   * @param {Partial<{resource: Resource, action: Action, description: string, isActive: boolean}>} updateData - The data to update.
   * @returns {Promise<IPermission | null>} A promise that resolves to the updated permission if found, or null otherwise.
   */
  async update(
    name: Permission,
    updateData: Partial<{
      resource: Resource
      action: Action
      description: string
      isActive: boolean
    }>,
  ): Promise<IPermission | null> {
    return await PermissionModel.findOneAndUpdate({ name }, updateData, {
      new: true,
    }).exec()
  }

  /**
   * Delete a permission (soft delete)
   * @param {Permission} name - The name of the permission to delete.
   * @returns {Promise<IPermission | null>} A promise that resolves to the deleted permission if found, or null otherwise.
   */
  async delete(name: Permission): Promise<IPermission | null> {
    return await PermissionModel.findOneAndUpdate(
      { name },
      { isActive: false },
      { new: true },
    ).exec()
  }

  /**
   * Check if a permission exists
   * @param {Permission} name - The name of the permission to check.
   * @returns {Promise<boolean>} A promise that resolves to true if the permission exists and is active, false otherwise.
   */
  async exists(name: Permission): Promise<boolean> {
    const count = await PermissionModel.countDocuments({
      name,
      isActive: true,
    }).exec()
    return count > 0
  }

  /**
   * Bulk create permissions
   * @param {Array<{name: Permission, resource: Resource, action: Action, description: string}>} permissionsData - The data for the permissions to create.
   * @returns {Promise<IPermission[]>} A promise that resolves to an array of created permissions.
   */
  async bulkCreate(
    permissionsData: Array<{
      name: Permission
      resource: Resource
      action: Action
      description: string
    }>,
  ): Promise<IPermission[]> {
    return await PermissionModel.insertMany(permissionsData)
  }
}
