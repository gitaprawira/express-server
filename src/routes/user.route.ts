import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { UserService } from '../services/user.service'
import { UserRepository } from '../repositories/user.repository'
import {
  isAuthenticated,
  requirePermission,
  requireAnyRole,
  requireOwnershipOrPermission,
} from '../middlewares/rbac.middleware'
import { Permission, Role } from '../types/rbac.types'

export default (router:Router) => {
    // Initialize Dependency Injection
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    /**
     * @swagger
     * tags:
     *  name: Users
     *  description: API endpoints for user management
     */

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Retrieve a paginated list of users
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 20
     *         description: Items per page
     *     responses:
     *       '200':
     *         description: A list of users
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 total:
     *                   type: integer
     *                   example: 123
     *                 items:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/User'
     *       '401':
     *         $ref: '#/components/responses/Unauthorized'
     *       '403':
     *         $ref: '#/components/responses/Forbidden'
     *         description: Insufficient permissions (requires USER_LIST permission)
     */
    // List all users - requires USER_LIST permission
    router.get('/users', isAuthenticated, requirePermission(Permission.USER_LIST), userController.getAllUsers)

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Retrieve a single user by ID
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       '200':
     *         description: User object
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       '401':
     *         $ref: '#/components/responses/Unauthorized'
     *       '403':
     *         $ref: '#/components/responses/Forbidden'
     *         description: Not the owner and lacks USER_READ permission
     *       '404':
     *         $ref: '#/components/responses/NotFound'
     *
     *   delete:
     *     summary: Delete a user by ID (Admin only)
     *     description: Requires SUPER_ADMIN or ADMIN role and USER_DELETE permission
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID to delete
     *     responses:
     *       '204':
     *         description: User deleted successfully (no content)
     *       '200':
     *         description: User deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "User deleted"
     *       '401':
     *         $ref: '#/components/responses/Unauthorized'
     *       '403':
     *         $ref: '#/components/responses/Forbidden'
     *         description: Not SUPER_ADMIN/ADMIN role or lacks USER_DELETE permission
     *       '404':
     *         $ref: '#/components/responses/NotFound'
     */
    // Get user by ID - requires USER_READ permission or ownership
    router.get('/users/:id', isAuthenticated, requireOwnershipOrPermission('id', Permission.USER_READ), userController.getUserById)
    
    // Delete user - requires USER_DELETE permission (admin only)
    router.delete('/users/:id', isAuthenticated, requireAnyRole([Role.SUPER_ADMIN, Role.ADMIN]), requirePermission(Permission.USER_DELETE), userController.deleteUser)

    /**
     * @swagger
     * components:
     *   securitySchemes:
     *     bearerAuth:
     *       type: http
     *       scheme: bearer
     *       bearerFormat: JWT
     *   schemas:
     *     User:
     *       type: object
     *       properties:
     *         id:
     *           type: string
     *           example: "605c5f8f1c4ae12b8c9b0d3a"
     *         email:
     *           type: string
     *           format: email
     *           example: "user@example.com"
     *         username:
     *           type: string
     *           example: "janedoe"
     *         firstname:
     *           type: string
     *           example: "Jane"
     *         lastname:
     *           type: string
     *           example: "Doe"
     *         image:
     *           type: string
     *           example: "https://example.com/profile/jane.jpg"
     *           description: URL of user profile image
     *         roles:
     *           type: array
     *           items:
     *             type: string
     *             enum: [super_admin, admin, manager, user, guest]
     *           example: ["user"]
     *           description: Array of roles assigned to the user
     *       required:
     *         - id
     *         - email
     *   responses:
     *     Unauthorized:
     *       description: Authentication required or invalid token
     *     Forbidden:
     *       description: Insufficient permissions (role or permission check failed)
     *     NotFound:
     *       description: Resource not found
     */
}
