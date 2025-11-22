import mongoose from 'mongoose'
import RoleModel from '../models/role.model'
import PermissionModel from '../models/permission.model'
import {
  Role,
  Permission,
  Resource,
  Action,
  IRolePermissions,
} from '../types/rbac.types'

/**
 * Permission definitions with their metadata
 */
const permissionsData = [
  // User permissions
  {
    name: Permission.USER_CREATE,
    resource: Resource.USER,
    action: Action.CREATE,
    description: 'Create new users',
  },
  {
    name: Permission.USER_READ,
    resource: Resource.USER,
    action: Action.READ,
    description: 'Read user information',
  },
  {
    name: Permission.USER_UPDATE,
    resource: Resource.USER,
    action: Action.UPDATE,
    description: 'Update user information',
  },
  {
    name: Permission.USER_DELETE,
    resource: Resource.USER,
    action: Action.DELETE,
    description: 'Delete users',
  },
  {
    name: Permission.USER_LIST,
    resource: Resource.USER,
    action: Action.LIST,
    description: 'List all users',
  },
  // Role permissions
  {
    name: Permission.ROLE_CREATE,
    resource: Resource.ROLE,
    action: Action.CREATE,
    description: 'Create new roles',
  },
  {
    name: Permission.ROLE_READ,
    resource: Resource.ROLE,
    action: Action.READ,
    description: 'Read role information',
  },
  {
    name: Permission.ROLE_UPDATE,
    resource: Resource.ROLE,
    action: Action.UPDATE,
    description: 'Update role information',
  },
  {
    name: Permission.ROLE_DELETE,
    resource: Resource.ROLE,
    action: Action.DELETE,
    description: 'Delete roles',
  },
  {
    name: Permission.ROLE_LIST,
    resource: Resource.ROLE,
    action: Action.LIST,
    description: 'List all roles',
  },
  {
    name: Permission.ROLE_ASSIGN,
    resource: Resource.ROLE,
    action: Action.ASSIGN,
    description: 'Assign roles to users',
  },
  // Permission permissions
  {
    name: Permission.PERMISSION_CREATE,
    resource: Resource.PERMISSION,
    action: Action.CREATE,
    description: 'Create new permissions',
  },
  {
    name: Permission.PERMISSION_READ,
    resource: Resource.PERMISSION,
    action: Action.READ,
    description: 'Read permission information',
  },
  {
    name: Permission.PERMISSION_UPDATE,
    resource: Resource.PERMISSION,
    action: Action.UPDATE,
    description: 'Update permission information',
  },
  {
    name: Permission.PERMISSION_DELETE,
    resource: Resource.PERMISSION,
    action: Action.DELETE,
    description: 'Delete permissions',
  },
  {
    name: Permission.PERMISSION_LIST,
    resource: Resource.PERMISSION,
    action: Action.LIST,
    description: 'List all permissions',
  },
  {
    name: Permission.PERMISSION_ASSIGN,
    resource: Resource.PERMISSION,
    action: Action.ASSIGN,
    description: 'Assign permissions to roles',
  },
  // Self permissions
  {
    name: Permission.SELF_READ,
    resource: Resource.PROFILE,
    action: Action.READ,
    description: 'Read own profile',
  },
  {
    name: Permission.SELF_UPDATE,
    resource: Resource.PROFILE,
    action: Action.UPDATE,
    description: 'Update own profile',
  },
  {
    name: Permission.SELF_DELETE,
    resource: Resource.PROFILE,
    action: Action.DELETE,
    description: 'Delete own account',
  },
]

/**
 * Role-Permission mappings
 */
const rolePermissionsMap: IRolePermissions[] = [
  {
    role: Role.SUPER_ADMIN,
    permissions: [
      // All permissions
      Permission.USER_CREATE,
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.USER_DELETE,
      Permission.USER_LIST,
      Permission.ROLE_CREATE,
      Permission.ROLE_READ,
      Permission.ROLE_UPDATE,
      Permission.ROLE_DELETE,
      Permission.ROLE_LIST,
      Permission.ROLE_ASSIGN,
      Permission.PERMISSION_CREATE,
      Permission.PERMISSION_READ,
      Permission.PERMISSION_UPDATE,
      Permission.PERMISSION_DELETE,
      Permission.PERMISSION_LIST,
      Permission.PERMISSION_ASSIGN,
      Permission.SELF_READ,
      Permission.SELF_UPDATE,
      Permission.SELF_DELETE,
    ],
  },
  {
    role: Role.ADMIN,
    permissions: [
      // User management
      Permission.USER_CREATE,
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.USER_DELETE,
      Permission.USER_LIST,
      // Role read only
      Permission.ROLE_READ,
      Permission.ROLE_LIST,
      // Self management
      Permission.SELF_READ,
      Permission.SELF_UPDATE,
    ],
  },
  {
    role: Role.MANAGER,
    permissions: [
      // Limited user management
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.USER_LIST,
      // Self management
      Permission.SELF_READ,
      Permission.SELF_UPDATE,
    ],
  },
  {
    role: Role.USER,
    permissions: [
      // Self management only
      Permission.SELF_READ,
      Permission.SELF_UPDATE,
    ],
  },
  {
    role: Role.GUEST,
    permissions: [
      // Read-only access
      Permission.SELF_READ,
    ],
  },
]

/**
 * Role definitions
 */
const rolesData = [
  {
    name: Role.SUPER_ADMIN,
    description: 'Super administrator with full system access',
  },
  {
    name: Role.ADMIN,
    description: 'Administrator with user management capabilities',
  },
  {
    name: Role.MANAGER,
    description: 'Manager with limited user management capabilities',
  },
  {
    name: Role.USER,
    description: 'Regular user with self-management capabilities',
  },
  {
    name: Role.GUEST,
    description: 'Guest user with read-only access',
  },
]

/**
 * Seed permissions into the database
 */
async function seedPermissions(): Promise<void> {
  console.log('Seeding permissions...')
  
  for (const permissionData of permissionsData) {
    const existingPermission = await PermissionModel.findOne({
      name: permissionData.name,
    })

    if (!existingPermission) {
      await PermissionModel.create(permissionData)
      console.log(`✓ Created permission: ${permissionData.name}`)
    } else {
      console.log(`- Permission already exists: ${permissionData.name}`)
    }
  }
  
  console.log('Permissions seeded successfully!\n')
}

/**
 * Seed roles into the database
 */
async function seedRoles(): Promise<void> {
  console.log('Seeding roles...')
  
  for (const roleData of rolesData) {
    const rolePermissions = rolePermissionsMap.find(
      (rp) => rp.role === roleData.name,
    )

    const existingRole = await RoleModel.findOne({ name: roleData.name })

    if (!existingRole) {
      await RoleModel.create({
        ...roleData,
        permissions: rolePermissions?.permissions || [],
      })
      console.log(`✓ Created role: ${roleData.name}`)
    } else {
      // Update permissions if role exists
      existingRole.permissions = rolePermissions?.permissions || []
      await existingRole.save()
      console.log(`- Updated role: ${roleData.name}`)
    }
  }
  
  console.log('Roles seeded successfully!\n')
}

/**
 * Main seeder function
 */
export async function seedRBAC(): Promise<void> {
  try {
    console.log('\n========================================')
    console.log('Starting RBAC Database Seeding')
    console.log('========================================\n')

    await seedPermissions()
    await seedRoles()

    console.log('========================================')
    console.log('RBAC Seeding Completed Successfully!')
    console.log('========================================\n')
  } catch (error) {
    console.error('Error seeding RBAC data:', error)
    throw error
  }
}

/**
 * Run seeder directly if this file is executed
 */
if (require.main === module) {
  const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/express-server'

  mongoose
    .connect(dbUrl)
    .then(async () => {
      console.log('Connected to MongoDB')
      await seedRBAC()
      await mongoose.disconnect()
      console.log('Disconnected from MongoDB')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Database connection error:', error)
      process.exit(1)
    })
}
