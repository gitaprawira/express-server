import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { AuthService } from '../services/auth.service'
import { UserRepository } from '../repositories/user.repository'
import { RoleRepository } from '../repositories/role.repository'
import { PermissionRepository } from '../repositories/permission.repository'
import { isAuthenticated } from '../middlewares/auth.middleware'

export default (router:Router) => {
    // Initialize Dependency Injection
    const userRepository = new UserRepository();
    const roleRepository = new RoleRepository();
    const permissionRepository = new PermissionRepository();
    const authService = new AuthService(roleRepository, permissionRepository, userRepository);
    const authController = new AuthController(authService);

    /**
     * @swagger
     * tags:
     *   name: Authentication
     *   description: API endpoints for user authentication and authorization
     */

    /**
     * @swagger
     * /auth/signin:
     *   post:
     *     summary: Authenticate a user and obtain JWT access and refresh tokens
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Credentials'
     *     responses:
     *       '200':
     *         description: Authentication successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthResponse'
     *       '400':
     *         description: Invalid credentials
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       '500':
     *         description: Server error
     */
    router.post('/auth/signin', authController.signIn)

    /**
     * @swagger
     * /auth/signup:
     *   post:
     *     summary: Create a new user account
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SignupRequest'
     *     responses:
     *       '201':
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       '400':
     *         description: Validation error
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       '409':
     *         description: Email already exists
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.post('/auth/signup', authController.signUp)

    /**
     * @swagger
     * /auth/signout:
     *   post:
     *     summary: Invalidate current access/refresh tokens (signout)
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SignoutRequest'
     *     responses:
     *       '200':
     *         description: Successfully Signed out
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Signed out successfully
     *       '401':
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.post('/auth/signout', authController.signOut)

    /**
     * @swagger
     * /auth/refresh:
     *   post:
     *     summary: Exchange a refresh token for a new access token
     *     tags:
     *       - Authentication
     *     responses:
     *       '200':
     *         description: Tokens refreshed
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Tokens'
     *       '401':
     *         description: Invalid or expired refresh token
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.post('/auth/refresh', authController.refreshToken)

    /**
     * @swagger
     * /auth/me:
     *   get:
     *     summary: Get the authenticated user's profile
     *     tags:
     *       - Authentication
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       '200':
     *         description: Authenticated user profile
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       '401':
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/auth/me', isAuthenticated, authController.me)

    /**
     * @swagger
     * components:
     *   securitySchemes:
     *     bearerAuth:
     *       type: http
     *       scheme: bearer
     *       bearerFormat: JWT
     *   schemas:
     *     Credentials:
     *       type: object
     *       required:
     *         - email
     *         - password
     *       properties:
     *         email:
     *           type: string
     *           format: email
     *           example: user@example.com
     *         password:
     *           type: string
     *           example: password123
     *     SignupRequest:
     *       type: object
     *       required:
     *         - email
     *         - password
     *         - username
     *         - firstname
     *         - lastname
     *       properties:
     *         username:
     *           type: string
     *           example: janedoe
     *         email:
     *           type: string
     *           format: email
     *           example: jane@example.com
     *         password:
     *           type: string
     *           format: password
     *           example: securePassword!23
     *         firstname:
     *           type: string
     *           example: Jane
     *         lastname:
     *           type: string
     *           example: Doe
     *         image:
     *           type: string
     *           example: https://example.com/profile/jane.jpg
     *           description: URL of user profile image (optional)
     *         roles:
     *           type: array
     *           items:
     *             type: string
     *             enum: [super_admin, admin, manager, user, guest]
     *           example: ["user"]
     *           description: Array of roles to assign to the user. Defaults to user role if not provided
     *     SignoutRequest:
     *       type: object
     *       required:
     *         - refreshToken
     *       properties:
     *         refreshToken:
     *           type: string
     *           example: dGhpcy1pcy1hLWZha2UtcmVmcmVzaC10b2tlbg==
     *     RefreshRequest:
     *       type: object
     *       required:
     *         - refreshToken
     *       properties:
     *         refreshToken:
     *           type: string
     *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *     User:
     *       type: object
     *       properties:
     *         id:
     *           type: string
     *           example: 612e3b8f9a1b2c0012345678
     *         username:
     *           type: string
     *           example: janedoe
     *         firstname:
     *           type: string
     *           example: Jane
     *         lastname:
     *           type: string
     *           example: Doe
     *         email:
     *           type: string
     *           format: email
     *           example: jane@example.com
     *         image:
     *           type: string
     *           example: https://example.com/profile/jane.jpg
     *           description: URL of user profile image
     *         roles:
     *           type: array
     *           items:
     *             type: string
     *             enum: [super_admin, admin, manager, user, guest]
     *           example: ["user"]
     *           description: Array of roles assigned to the user
     *         createdAt:
     *           type: string
     *           format: date-time
     *           example: 2025-01-01T12:00:00.000Z
     *         updatedAt:
     *           type: string
     *           format: date-time
     *           example: 2025-01-01T12:00:00.000Z
     *     Tokens:
     *       type: object
     *       properties:
     *         accessToken:
     *           type: string
     *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *         refreshToken:
     *           type: string
     *           example: dGhpcy1pcy1hLWZha2UtcmVmcmVzaC10b2tlbg==
     *     AuthResponse:
     *       type: object
     *       properties:
     *         user:
     *           $ref: '#/components/schemas/User'
     *         accessToken:
     *           type: string
     *         refreshToken:
     *           type: string
     *     ErrorResponse:
     *       type: object
     *       properties:
     *         error:
     *           type: string
     *           example: Invalid credentials
     *     LogoutRequest:
     *       type: object
     *       properties:
     *         refreshToken:
     *           type: string
     *           example: dGhpcy1pcy1hLWZha2UtcmVmcmVzaC10b2tlbg==
     */
}
