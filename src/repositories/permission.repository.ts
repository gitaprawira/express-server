import PermissionModel, { IPermission } from '../models/permission.model'
import { Permission, Resource, Action } from '../types/rbac.types'

/**
 * Permission Repository
 * Following Repository Pattern and Single Responsibility Principle
 * Handles all database operations for permissions
 */
export class PermissionRepository {
  /**
   * Find permission by name
   */
  async findByName(name: Permission): Promise<IPermission | null> {
    return await PermissionModel.findOne({ name, isActive: true }).exec()
  }

  /**
   * Find multiple permissions by names
   */
  async findByNames(names: Permission[]): Promise<IPermission[]> {
    return await PermissionModel.find({
      name: { $in: names },
      isActive: true,
    }).exec()
  }

  /**
   * Find permissions by resource
   */
  async findByResource(resource: Resource): Promise<IPermission[]> {
    return await PermissionModel.find({ resource, isActive: true }).exec()
  }

  /**
   * Find permissions by resource and action
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
   */
  async findAll(): Promise<IPermission[]> {
    return await PermissionModel.find({ isActive: true }).exec()
  }

  /**
   * Create a new permission
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
