import { Role, Permission, IPermissionCheckResult } from '../types/rbac.types'
import { RoleRepository } from '../repositories/role.repository'
import {
  MESSAGE_NO_ROLES_ASSIGNED,
  MESSAGE_INSUFFICIENT_PERMISSIONS,
  MESSAGE_ROLE_NOT_FOUND,
} from '../utils/constans'

export class RbacService {
  constructor(private readonly roleRepository: RoleRepository) {}

  private noRolesResult(): IPermissionCheckResult {
    return { granted: false, reason: MESSAGE_NO_ROLES_ASSIGNED }
  }

  async hasPermission(
    userRoles: Role[],
    requiredPermission: Permission,
  ): Promise<IPermissionCheckResult> {
    if (!userRoles?.length) return this.noRolesResult()
    const permissions =
      await this.roleRepository.getPermissionsForRoles(userRoles)
    return permissions.includes(requiredPermission)
      ? { granted: true }
      : { granted: false, reason: MESSAGE_INSUFFICIENT_PERMISSIONS }
  }

  async hasAnyPermission(
    userRoles: Role[],
    requiredPermissions: Permission[],
  ): Promise<IPermissionCheckResult> {
    if (!userRoles?.length) return this.noRolesResult()
    const permissions =
      await this.roleRepository.getPermissionsForRoles(userRoles)
    return requiredPermissions.some((p) => permissions.includes(p))
      ? { granted: true }
      : { granted: false, reason: MESSAGE_INSUFFICIENT_PERMISSIONS }
  }

  async hasAllPermissions(
    userRoles: Role[],
    requiredPermissions: Permission[],
  ): Promise<IPermissionCheckResult> {
    if (!userRoles?.length) return this.noRolesResult()
    const permissions =
      await this.roleRepository.getPermissionsForRoles(userRoles)
    return requiredPermissions.every((p) => permissions.includes(p))
      ? { granted: true }
      : { granted: false, reason: MESSAGE_INSUFFICIENT_PERMISSIONS }
  }

  hasRole(userRoles: Role[], requiredRole: Role): IPermissionCheckResult {
    if (!userRoles?.length) return this.noRolesResult()
    return userRoles.includes(requiredRole)
      ? { granted: true }
      : { granted: false, reason: MESSAGE_ROLE_NOT_FOUND }
  }

  hasAnyRole(
    userRoles: Role[],
    requiredRoles: Role[],
  ): IPermissionCheckResult {
    if (!userRoles?.length) return this.noRolesResult()
    return requiredRoles.some((role) => userRoles.includes(role))
      ? { granted: true }
      : { granted: false, reason: MESSAGE_ROLE_NOT_FOUND }
  }

  async getUserPermissions(userRoles: Role[]): Promise<Permission[]> {
    if (!userRoles?.length) return []
    return this.roleRepository.getPermissionsForRoles(userRoles)
  }

  isOwner(userId: string, resourceOwnerId: string): IPermissionCheckResult {
    return userId === resourceOwnerId
      ? { granted: true }
      : { granted: false, reason: MESSAGE_INSUFFICIENT_PERMISSIONS }
  }
}
