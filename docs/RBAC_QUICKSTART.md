# RBAC Quick Reference

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create a `.env` file:

```env
MONGODB_URL=mongodb://localhost:27017/express-server
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

### 3. Seed RBAC Data

```bash
npm run seed:rbac
```

### 4. Start Server

```bash
npm run dev
```

## Available Roles

- `super_admin` - Full system access
- `admin` - User management
- `manager` - Limited user management
- `user` - Self management only
- `guest` - Read-only access

## Available Permissions

### User Permissions

- `user:create` - Create new users
- `user:read` - Read user information
- `user:update` - Update user information
- `user:delete` - Delete users
- `user:list` - List all users

### Role Permissions

- `role:create` - Create roles
- `role:read` - Read role information
- `role:update` - Update roles
- `role:delete` - Delete roles
- `role:list` - List roles
- `role:assign` - Assign roles to users

### Permission Management

- `permission:create` - Create permissions
- `permission:read` - Read permissions
- `permission:update` - Update permissions
- `permission:delete` - Delete permissions
- `permission:list` - List permissions
- `permission:assign` - Assign permissions

### Self Management

- `self:read` - Read own profile
- `self:update` - Update own profile
- `self:delete` - Delete own account

## Middleware Usage

### Single Permission

```typescript
router.get('/users', 
  isAuthenticated, 
  requirePermission(Permission.USER_LIST),
  controller.getAllUsers
)
```

### Multiple Permissions (Any)

```typescript
router.get('/users', 
  isAuthenticated, 
  requireAnyPermission([Permission.USER_READ, Permission.USER_LIST]),
  controller.getAllUsers
)
```

### Multiple Permissions (All)

```typescript
router.post('/users', 
  isAuthenticated, 
  requireAllPermissions([Permission.USER_CREATE, Permission.ROLE_ASSIGN]),
  controller.createUser
)
```

### Role Check

```typescript
router.delete('/users/:id', 
  isAuthenticated, 
  requireRole(Role.ADMIN),
  controller.deleteUser
)
```

### Multiple Roles (Any)

```typescript
router.delete('/users/:id', 
  isAuthenticated, 
  requireAnyRole([Role.SUPER_ADMIN, Role.ADMIN]),
  controller.deleteUser
)
```

### Ownership or Permission

```typescript
router.get('/users/:id', 
  isAuthenticated, 
  requireOwnershipOrPermission('id', Permission.USER_READ),
  controller.getUserById
)
```

### Ownership or Admin

```typescript
router.put('/users/:id', 
  isAuthenticated, 
  requireOwnershipOrAdmin('id'),
  controller.updateUser
)
```

## API Examples

### Register User with Roles

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123",
  "username": "admin",
  "firstname": "Admin",
  "lastname": "User",
  "roles": ["admin", "user"]
}
```

### Login

```bash
POST /api/auth/signin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123"
}
```

### Get All Roles (Admin)

```bash
GET /api/roles
Authorization: Bearer <your-jwt-token>
```

### Create New Role (Super Admin)

```bash
POST /api/roles
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "custom_role",
  "description": "Custom role",
  "permissions": ["user:read", "user:update"]
}
```

### Update Role Permissions (Super Admin)

```bash
PUT /api/roles/admin/permissions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "permissions": ["user:create", "user:read", "user:update", "user:delete"]
}
```

## File Structure

```text
src/
├── types/
│   └── rbac.types.ts          # RBAC type definitions
├── models/
│   ├── role.model.ts          # Role schema
│   ├── permission.model.ts    # Permission schema
│   └── user.model.ts          # User schema (updated)
├── repositories/
│   ├── role.repository.ts     # Role data access
│   └── permission.repository.ts # Permission data access
├── services/
│   ├── authorization.service.ts # Authorization logic
│   └── role.service.ts         # Role management
├── middlewares/
│   ├── auth.middleware.ts      # Authentication
│   └── rbac.middleware.ts      # RBAC authorization
├── controllers/
│   └── role.controller.ts      # Role endpoints
├── routes/
│   └── role.route.ts           # Role routes
└── seeders/
    └── rbac.seeder.ts          # Database seeder
```

## Testing

### Create Test User

```typescript
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser',
  roles: [Role.USER]
}
```

### Test Permission Check

```typescript
const hasPermission = await authorizationService.hasPermission(
  user.roles,
  Permission.USER_READ
)
```

### Test Role Check

```typescript
const hasRole = await authorizationService.hasRole(
  user.roles,
  Role.ADMIN
)
```

## Common Patterns

### Admin-Only Endpoint

```typescript
router.delete('/admin/resource',
  isAuthenticated,
  requireAnyRole([Role.SUPER_ADMIN, Role.ADMIN]),
  requirePermission(Permission.RESOURCE_DELETE),
  controller.delete
)
```

### User or Admin Access

```typescript
router.get('/users/:id',
  isAuthenticated,
  requireOwnershipOrPermission('id', Permission.USER_READ),
  controller.getUser
)
```

### Read-Only for Regular Users

```typescript
router.get('/resources',
  isAuthenticated,
  requireAnyPermission([Permission.RESOURCE_READ, Permission.SELF_READ]),
  controller.list
)
```

## Troubleshooting

### Issue: "No roles assigned"

**Solution**: Run the seeder or manually assign roles to users

### Issue: Permission denied for admin

**Solution**: Check role-permission mappings in database

### Issue: Middleware not working

**Solution**: Ensure `isAuthenticated` comes before RBAC middleware

### Issue: Can't access after seeding

**Solution**: Re-login to get updated user data with roles

## Documentation

For detailed documentation, see [RBAC_DOCUMENTATION.md](./RBAC_DOCUMENTATION.md)
