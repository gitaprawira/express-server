import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { UserService } from '../services/user.service'
import { UserRepository } from '../repositories/user.repository'
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware'

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
     * /api/users:
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
     */
    router.get('/users', isAuthenticated, userController.getAllUsers)

    /**
     * @swagger
     * /api/users/{id}:
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
     *       '404':
     *         $ref: '#/components/responses/NotFound'
     *
     *   delete:
     *     summary: Delete a user by ID
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
     *       '404':
     *         $ref: '#/components/responses/NotFound'
     */
    router.get('/users/:id', isAuthenticated, isAdmin, userController.getUserById)
    router.delete('/users/:id', isAuthenticated, isAdmin, userController.deleteUser)

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
     *         isAdmin:
     *           type: boolean
     *           example: true
     *       required:
     *         - id
     *         - email
     *   responses:
     *     Unauthorized:
     *       description: Authentication required or invalid token
     *     Forbidden:
     *       description: Insufficient permissions
     *     NotFound:
     *       description: Resource not found
     */
}
