# RBAC Implementation Documentation

## Overview

This project implements a comprehensive **Role-Based Access Control (RBAC)** system following **SOLID principles** for an Express.js backend with TypeScript and MongoDB.

## Architecture

The RBAC implementation follows a layered architecture:

```text
┌─────────────────────────────────────┐
│         Routes Layer                │
│  (HTTP endpoints with middleware)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Controllers Layer             │
│   (Request/Response handling)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Services Layer               │
│    (Business logic & RBAC)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Repositories Layer             │
│   (Database operations)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Models Layer                │
│   (MongoDB schemas)                 │
└─────────────────────────────────────┘
```

## SOLID Principles Applied

### 1. Single Responsibility Principle (SRP)

- Each class/module has one reason to change
- **AuthService**: Only handles authorization logic
- **RoleRepository**: Only handles role database operations
- **PermissionRepository**: Only handles permission database operations
- **RoleService**: Only handles role business logic

### 2. Open/Closed Principle (OCP)

- Easy to extend without modifying existing code
- New permissions can be added to the enum
- New middleware factories can be created without changing existing ones
- Role-permission mappings can be extended in the seeder

### 3. Liskov Substitution Principle (LSP)

- Repositories can be replaced with test doubles
- Services depend on abstractions (repositories)
- Middleware functions are composable

### 4. Interface Segregation Principle (ISP)

- Specific interfaces for different concerns
- `IPermissionCheckResult` for authorization results
- `IRolePermissions` for role-permission mappings
- `IAuthorizationContext` for context-aware checks

### 5. Dependency Inversion Principle (DIP)

- High-level modules don't depend on low-level modules
- Services depend on repository abstractions
- Controllers depend on service abstractions
- Easy to inject dependencies for testing

## Core Components

### 1. Types & Enums (`src/types/rbac.types.ts`)

```typescript
enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest',
}

enum Permission {
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  // ... more permissions
}
```

### 2. Models

#### Role Model (`src/models/role.model.ts`)

- Stores role definitions
- Associates permissions with roles
- Supports soft deletion

#### Permission Model (`src/models/permission.model.ts`)

- Stores permission definitions
- Maps to resources and actions
- Enables granular access control

#### User Model (Updated)

- Added `roles: Role[]` field
- Added `image?: string` field for user profile pictures
- Default role is `USER`

### 3. Repositories

#### RoleRepository (`src/repositories/role.repository.ts`)

```typescript
class RoleRepository {
  findByName(name: Role): Promise<IRole | null>
  findByNames(names: Role[]): Promise<IRole[]>
  getPermissionsForRoles(roles: Role[]): Promise<Permission[]>
  updatePermissions(role: Role, permissions: Permission[]): Promise<IRole>
  // ... more methods
}
```

#### PermissionRepository (`src/repositories/permission.repository.ts`)

```typescript
class PermissionRepository {
  findByName(name: Permission): Promise<IPermission | null>
  findByResource(resource: Resource): Promise<IPermission[]>
  bulkCreate(permissions: PermissionData[]): Promise<IPermission[]>
  // ... more methods
}
```

### 4. Services

#### AuthService (`src/services/auth.service.ts`)

Centralized authorization logic:

```typescript
class AuthService {
  hasPermission(userRoles: Role[], permission: Permission): Promise<IPermissionCheckResult>
  hasAnyPermission(userRoles: Role[], permissions: Permission[]): Promise<IPermissionCheckResult>
  hasAllPermissions(userRoles: Role[], permissions: Permission[]): Promise<IPermissionCheckResult>
  hasRole(userRoles: Role[], role: Role): Promise<IPermissionCheckResult>
  hasAnyRole(userRoles: Role[], roles: Role[]): Promise<IPermissionCheckResult>
  isOwner(userId: string, resourceOwnerId: string): IPermissionCheckResult
}
```

#### RoleService (`src/services/role.service.ts`)

Role management operations:

```typescript
class RoleService {
  getAllRoles(): Promise<IRole[]>
  getRoleByName(name: Role): Promise<IRole>
  createRole(name: Role, description: string, permissions: Permission[]): Promise<IRole>
  updateRolePermissions(name: Role, permissions: Permission[]): Promise<IRole>
  // ... more methods
}
```

### 5. Middleware (`src/middlewares/auth.middleware.ts`)

Flexible middleware factories for route protection:

```typescript
// Single permission check
requirePermission(Permission.USER_READ)

// Any of multiple permissions
requireAnyPermission([Permission.USER_READ, Permission.USER_UPDATE])

// All permissions required
requireAllPermissions([Permission.USER_READ, Permission.USER_UPDATE])

// Single role check
requireRole(Role.ADMIN)

// Any of multiple roles
requireAnyRole([Role.ADMIN, Role.MANAGER])

// Owner or admin check
requireOwnershipOrAdmin('userId')

// Owner or specific permission
requireOwnershipOrPermission('userId', Permission.USER_UPDATE)
```

## Default Role-Permission Matrix

| Role | Permissions |
|------|-------------|
| **SUPER_ADMIN** | All permissions (full system access) |
| **ADMIN** | User management, role read, self management |
| **MANAGER** | User read/update/list, self management |
| **USER** | Self read and update only |
| **GUEST** | Self read only |

## Usage Examples

### 1. Protecting Routes

```typescript
// In user.route.ts
router.get('/users', 
  isAuthenticated, 
  requirePermission(Permission.USER_LIST), 
  userController.getAllUsers
)

router.delete('/users/:id', 
  isAuthenticated, 
  requireAnyRole([Role.SUPER_ADMIN, Role.ADMIN]),
  requirePermission(Permission.USER_DELETE),
  userController.deleteUser
)

router.get('/users/:id', 
  isAuthenticated,
  requireOwnershipOrPermission('id', Permission.USER_READ),
  userController.getUserById
)
```

### 2. Creating Users with Roles

```typescript
// Register a new user with custom roles
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "johndoe",
  "firstname": "John",
  "lastname": "Doe",
  "roles": ["user", "manager"]
}
```

### 3. Managing Roles (Super Admin only)

```typescript
// Get all roles
GET /api/roles

// Create new role
POST /api/roles
{
  "name": "custom_role",
  "description": "Custom role description",
  "permissions": ["user:read", "user:update"]
}

// Update role permissions
PUT /api/roles/admin/permissions
{
  "permissions": ["user:create", "user:read", "user:update"]
}
```

## Database Seeding

### Running the Seeder

The seeder creates all predefined roles and permissions:

```bash
# Using npm script
npm run seed:rbac

# Or directly with ts-node
ts-node src/seeders/rbac.seeder.ts
```

The seeder will:

1. Create all permission definitions
2. Create all role definitions
3. Assign permissions to roles based on the matrix
4. Update existing roles if they already exist

## Migration Guide

### For Existing Users

The system maintains backward compatibility:

- Existing users without roles get `[Role.USER]` by default
- Users can have multiple roles assigned
- User profile images can be stored in the `image` field

### Updating Existing Routes

**Before (role-based middleware):**

```typescript
router.get('/users/:id', isAuthenticated, requireRole(Role.ADMIN), userController.getUserById)
```

**After (permission-based middleware - recommended):**

```typescript
router.get('/users/:id', 
  isAuthenticated, 
  requirePermission(Permission.USER_READ),
  userController.getUserById
)
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user (with optional roles)
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - List all users (requires `USER_LIST`)
- `GET /api/users/:id` - Get user by ID (owner or `USER_READ`)
- `DELETE /api/users/:id` - Delete user (admin + `USER_DELETE`)

### Roles (Super Admin only)

- `GET /api/roles` - List all roles (requires `ROLE_LIST`)
- `GET /api/roles/:name` - Get role details (requires `ROLE_READ`)
- `POST /api/roles` - Create role (requires `ROLE_CREATE`)
- `PUT /api/roles/:name/permissions` - Update permissions
- `POST /api/roles/:name/permissions/add` - Add permissions
- `POST /api/roles/:name/permissions/remove` - Remove permissions
- `DELETE /api/roles/:name` - Delete role (requires `ROLE_DELETE`)

## Testing Recommendations

### 1. Unit Tests

```typescript
describe('AuthService', () => {
  it('should grant permission when user has required role', async () => {
    const result = await authService.hasPermission(
      [Role.ADMIN], 
      Permission.USER_READ
    )
    expect(result.granted).toBe(true)
  })
})
```

### 2. Integration Tests

```typescript
describe('User Routes RBAC', () => {
  it('should deny access without permission', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`)
    expect(response.status).toBe(403)
  })
})
```

## Environment Variables

Ensure these are set in your `.env`:

```env
MONGODB_URL=mongodb://localhost:27017/express-api
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

## Best Practices

1. **Always use middleware chains**: `isAuthenticated` → RBAC checks
2. **Prefer permissions over roles**: More granular control
3. **Use ownership checks**: Combine with role/permission checks
4. **Seed on deployment**: Run seeder after database migrations
5. **Audit regularly**: Review role-permission mappings
6. **Least privilege**: Start with minimal permissions, add as needed

## Extending the System

### Adding New Permissions

1. Add to `Permission` enum in `rbac.types.ts`
2. Add to permissions data in `rbac.seeder.ts`
3. Assign to appropriate roles in role-permission matrix
4. Run seeder to update database

### Adding New Roles

1. Add to `Role` enum in `rbac.types.ts`
2. Add to roles data in `rbac.seeder.ts`
3. Define permission matrix
4. Run seeder to update database

### Custom Authorization Logic

Create new middleware in `auth.middleware.ts`:

```typescript
export const requireCustomCheck = (param: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Your custom logic
    const result = await customAuthCheck(req.user, param)
    if (!result.granted) {
      return res.status(HTTP_FORBIDDEN).json({
        success: false,
        message: result.reason,
      })
    }
    next()
  }
}
```

## Troubleshooting

### Common Issues

1. **"No roles assigned" error**
   - Ensure user has roles in database
   - Run seeder to create default roles
   - Check user model has roles field

2. **Permission denied for admin**
   - Verify role-permission mappings in database
   - Check if seeder was run successfully
   - Ensure middleware order is correct

3. **Database connection errors**
   - Verify MONGODB_URL environment variable
   - Check database is running
   - Verify network connectivity

## Performance Considerations

1. **Caching**: Consider caching role-permission mappings
2. **Indexes**: Database indexes on `roles` and `name` fields
3. **Batch operations**: Use `getPermissionsForRoles` instead of multiple queries
4. **Middleware order**: Put lightweight checks before heavy ones

## Security Considerations

1. **Always validate input**: Especially role/permission assignments
2. **Audit logs**: Log permission checks and role assignments
3. **Rate limiting**: Protect role management endpoints
4. **Principle of least privilege**: Start restrictive, loosen as needed
5. **Regular reviews**: Audit role-permission mappings periodically

## Conclusion

This RBAC implementation provides:

- ✅ Flexible and granular access control
- ✅ SOLID principles compliance
- ✅ Easy to extend and maintain
- ✅ Type-safe with TypeScript
- ✅ Well-documented and tested
- ✅ Backward compatible
- ✅ Production-ready

For questions or issues, refer to the inline code documentation or create an issue in the repository.
