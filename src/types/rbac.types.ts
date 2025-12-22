/**
 * System-wide roles
 */
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest',
}

/**
 * Granular permissions for resources
 */
export enum Permission {
  // User Management
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_LIST = 'user:list',

  // Role Management
  ROLE_CREATE = 'role:create',
  ROLE_READ = 'role:read',
  ROLE_UPDATE = 'role:update',
  ROLE_DELETE = 'role:delete',
  ROLE_LIST = 'role:list',
  ROLE_ASSIGN = 'role:assign',

  // Permission Management
  PERMISSION_CREATE = 'permission:create',
  PERMISSION_READ = 'permission:read',
  PERMISSION_UPDATE = 'permission:update',
  PERMISSION_DELETE = 'permission:delete',
  PERMISSION_LIST = 'permission:list',
  PERMISSION_ASSIGN = 'permission:assign',

  // Self operations
  SELF_READ = 'self:read',
  SELF_UPDATE = 'self:update',
  SELF_DELETE = 'self:delete',
}

/**
 * Resource types in the system
 */
export enum Resource {
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
  PROFILE = 'profile',
}

/**
 * Action types for permissions
 */
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  ASSIGN = 'assign',
}

/**
 * Interface for role-permission mapping
 */
export interface IRolePermissions {
  role: Role
  permissions: Permission[]
}

/**
 * Interface for permission check result
 */
export interface IPermissionCheckResult {
  granted: boolean
  reason?: string
}

/**
 * Interface for authorization context
 */
export interface IAuthorizationContext {
  userId: string
  roles: Role[]
  permissions: Permission[]
  resourceId?: string
  resource?: Resource
}
