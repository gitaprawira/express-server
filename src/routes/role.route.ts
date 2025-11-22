import { Router } from 'express'
import { RoleController } from '../controllers/role.controller'
import { RoleService } from '../services/role.service'
import { RoleRepository } from '../repositories/role.repository'
import {
  isAuthenticated,
  requirePermission,
  requireRole,
  requireAnyRole,
} from '../middlewares/rbac.middleware'
import { Permission, Role } from '../types/rbac.types'

export default (router: Router) => {
  // Initialize Dependency Injection
  const roleRepository = new RoleRepository()
  const roleService = new RoleService(roleRepository)
  const roleController = new RoleController(roleService)

  /**
   * @swagger
   * tags:
   *  name: Roles
   *  description: API endpoints for role management
   */

  /**
   * @swagger
   * /api/roles:
   *   get:
   *     summary: Get all roles
   *     description: Retrieve a list of all roles with their permissions. Requires ROLE_LIST permission.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: List of all roles
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 statusCode:
   *                   type: integer
   *                   example: 200
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Role'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   */
  router.get(
    '/roles',
    isAuthenticated,
    requirePermission(Permission.ROLE_LIST),
    roleController.getAllRoles,
  )

  /**
   * @swagger
   * /api/roles/{name}:
   *   get:
   *     summary: Get role by name
   *     description: Retrieve details of a specific role including its permissions. Requires ROLE_READ permission.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         schema:
   *           type: string
   *           enum: [super_admin, admin, manager, user, guest]
   *         description: Role name
   *     responses:
   *       '200':
   *         description: Role details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Role'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         description: Role not found
   */
  router.get(
    '/roles/:name',
    isAuthenticated,
    requirePermission(Permission.ROLE_READ),
    roleController.getRoleByName,
  )

  /**
   * @swagger
   * /api/roles:
   *   post:
   *     summary: Create a new role (Super Admin only)
   *     description: Create a new role with specified permissions. Requires SUPER_ADMIN role and ROLE_CREATE permission.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - description
   *             properties:
   *               name:
   *                 type: string
   *                 enum: [super_admin, admin, manager, user, guest]
   *                 example: manager
   *               description:
   *                 type: string
   *                 example: Manager role with limited user management
   *               permissions:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: [\"user:read\", \"user:update\", \"user:list\"]
   *     responses:
   *       '201':
   *         description: Role created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 statusCode:
   *                   type: integer
   *                   example: 201
   *                 data:
   *                   $ref: '#/components/schemas/Role'
   *       '400':
   *         description: Bad request or role already exists
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   */
  router.post(
    '/roles',
    isAuthenticated,
    requireAnyRole([Role.SUPER_ADMIN]),
    requirePermission(Permission.ROLE_CREATE),
    roleController.createRole,
  )

  /**
   * @swagger
   * /api/roles/{name}/permissions:
   *   put:
   *     summary: Update role permissions (Super Admin only)
   *     description: Replace all permissions for a role. Requires SUPER_ADMIN role and PERMISSION_ASSIGN permission.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         schema:
   *           type: string
   *           enum: [super_admin, admin, manager, user, guest]
   *         description: Role name to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - permissions
   *             properties:
   *               permissions:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: [\"user:read\", \"user:update\", \"user:list\", \"self:read\", \"self:update\"]
   *                 description: Complete list of permissions to assign (replaces existing)
   *     responses:
   *       '200':
   *         description: Permissions updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 statusCode:
   *                   type: integer
   *                   example: 200
   *                 data:
   *                   $ref: '#/components/schemas/Role'
   *       '400':
   *         description: Bad request
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         description: Role not found
   */
  router.put(
    '/roles/:name/permissions',
    isAuthenticated,
    requireAnyRole([Role.SUPER_ADMIN]),
    requirePermission(Permission.PERMISSION_ASSIGN),
    roleController.updateRolePermissions,
  )

  /**
   * @swagger
   * /api/roles/{name}/permissions/add:
   *   post:
   *     summary: Add permissions to role (Super Admin only)
   *     description: Add additional permissions to an existing role without removing current ones. Requires SUPER_ADMIN role and PERMISSION_ASSIGN permission.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         schema:
   *           type: string
   *           enum: [super_admin, admin, manager, user, guest]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - permissions
   *             properties:
   *               permissions:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: [\"user:delete\"]
   *     responses:
   *       '200':
   *         description: Permissions added successfully
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   */
  router.post(
    '/roles/:name/permissions/add',
    isAuthenticated,
    requireAnyRole([Role.SUPER_ADMIN]),
    requirePermission(Permission.PERMISSION_ASSIGN),
    roleController.addPermissions,
  )

  /**
   * @swagger
   * /api/roles/{name}/permissions/remove:
   *   post:
   *     summary: Remove permissions from role (Super Admin only)
   *     description: Remove specific permissions from a role. Requires SUPER_ADMIN role and PERMISSION_ASSIGN permission.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         schema:
   *           type: string
   *           enum: [super_admin, admin, manager, user, guest]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - permissions
   *             properties:
   *               permissions:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: [\"user:delete\"]
   *     responses:
   *       '200':
   *         description: Permissions removed successfully
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   */
  router.post(
    '/roles/:name/permissions/remove',
    isAuthenticated,
    requireAnyRole([Role.SUPER_ADMIN]),
    requirePermission(Permission.PERMISSION_ASSIGN),
    roleController.removePermissions,
  )

  /**
   * @swagger
   * /api/roles/{name}:
   *   delete:
   *     summary: Delete a role (Super Admin only)
   *     description: Soft delete a role (marks as inactive). Requires SUPER_ADMIN role and ROLE_DELETE permission.
   *     tags:
   *       - Roles
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         schema:
   *           type: string
   *           enum: [super_admin, admin, manager, user, guest]
   *     responses:
   *       '200':
   *         description: Role deleted successfully
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         description: Role not found
   */
  router.delete(
    '/roles/:name',
    isAuthenticated,
    requireAnyRole([Role.SUPER_ADMIN]),
    requirePermission(Permission.ROLE_DELETE),
    roleController.deleteRole,
  )

  /**
   * @swagger
   * components:
   *   schemas:
   *     Role:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           example: 612e3b8f9a1b2c0012345678
   *         name:
   *           type: string
   *           enum: [super_admin, admin, manager, user, guest]
   *           example: admin
   *         description:
   *           type: string
   *           example: Administrator with user management capabilities
   *         permissions:
   *           type: array
   *           items:
   *             type: string
   *           example: [\"user:create\", \"user:read\", \"user:update\", \"user:delete\", \"user:list\", \"role:read\", \"role:list\", \"self:read\", \"self:update\"]
   *         isActive:
   *           type: boolean
   *           example: true
   *         createdAt:
   *           type: string
   *           format: date-time
   *         updatedAt:
   *           type: string
   *           format: date-time
   *   responses:
   *     Unauthorized:
   *       description: Authentication required or invalid token
   *     Forbidden:
   *       description: Insufficient permissions (role or permission check failed)
   */
}
