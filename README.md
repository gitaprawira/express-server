# Node.js Express TypeScript MongoDB Boilerplate

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust and scalable boilerplate for building RESTful APIs using Node.js, Express, TypeScript, and MongoDB. This project provides a solid foundation with a structured setup, ready for you to build your application's features.

---

## Features

- **TypeScript Ready**: Full TypeScript support for type safety and better developer experience.
- **Express.js Server**: Fast and minimalist web framework for Node.js.
- **MongoDB Integration**: Uses Mongoose for elegant MongoDB object modeling.
- **Role-Based Access Control (RBAC)**: Comprehensive permission system with 5 roles and 19 granular permissions.
- **JWT Authentication**: Secure authentication with access and refresh tokens.
- **Swagger/OpenAPI Documentation**: Interactive API documentation at `/api-docs`.
- **Environment Variables**: Centralized configuration using `.env` files.
- **Error Handling**: Global error handler with custom error classes.
- **Repository Pattern**: Clean architecture with separation of concerns.
- **Middleware System**: Authentication, authorization, and error handling middlewares.
- **Docker Support**: Containerized deployment with Docker Compose.
- **Database Seeding**: Quick setup with RBAC data seeder.
- **Structured Logging**: Pre-configured for clear and informative logs.
- **Scalable Architecture**: Organized folder structure to keep your code maintainable.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose)
- **Environment Management**: dotenv

---

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/) (v20.x or later recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (either a local instance or a MongoDB Atlas account).
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Getting Started

Follow these steps to get your development environment set up and running.

### 1. Clone the repository

```bash
git clone https://github.com/gitaprawira/express-server
cd express-server
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

### 3. Set up environment variables

Create a .env file in the root directory of the project by copying the example file:

```bash
cp .env.example .env
```

Now, open the .env file and update the variables with your configuration, especially your MongoDB connection string and server port.

```.env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/express-api

# Server Configuration
PORT=8080

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Password Encryption (Optional)
PWS_SECRET=your-password-encryption-secret

# Node Environment
NODE_ENV=development
```

> **🔐 Security Note**: Never commit your `.env` file or share your secrets. Use strong, randomly generated secrets in production.

---

## Running the Application

You can run the application in two modes:

### Development Mode

This command starts the server with a tool like ts-node-dev, which automatically restarts the server when you make changes to the code.

```bash
npm run dev
```

### Production Mode

This command first builds the TypeScript code into JavaScript in the dist/ directory and then starts the application from the compiled code.

```bash
# Build the project
npm run build

# Start the server
npm start
```

The server should now be running on the port you specified in your .env file (e.g., <http://localhost:8080>).

---

## API Documentation

Once the server is running, you can access the interactive Swagger API documentation:

- **Swagger UI**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
- **Health Check**: [http://localhost:8080/health](http://localhost:8080/health)
- **API Base URL**: [http://localhost:8080/api](http://localhost:8080/api)

### Quick Start Guide

1. **Seed the database** with default roles and permissions:

```bash
npm run seed:rbac
```

2. **Create a test admin user** via API:

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "username": "admin",
    "firstname": "Admin",
    "lastname": "User",
    "roles": ["admin"]
  }'
```

3. **Login to get access token**:

```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

4. **Use the token** to access protected endpoints:

```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### TypeScript + Node

The main purpose of this repository is to show a project setup and workflow for writing microservice. The Rest APIs will be using the Swagger (OpenAPI) Specification.

### Getting TypeScript

Add Typescript to project `npm`.

```bash
npm install -D typescript
```

## Running with Docker (Recommended)

This project is configured to run entirely within Docker using Docker Compose. This method starts both the Node.js application and its dedicated MongoDB database with a single command.

### 1. Create the Environment File

Create a `.env` file in the root of this project. Docker Compose will automatically inject these variables into your services.

**`express-server/.env`**

> **⚠️ WARNING:**  
> The secret values below are placeholders.  
> **Replace `<your-secret-here>` with strong, unique secrets in production. Never use example secrets in real deployments.**

```.env
# NOTE: The host is 'database', which is the service name from docker-compose.yml
MONGODB_URL=mongodb://admin:password@database:27017/pos?authSource=admin
PORT=8080
PWS_SECRET=<your-secret-here>

# Your JWT variables
JWT_SECRET=<your-jwt-secret-here>
JWT_REFRESH_SECRET=<your-jwt-refresh-secret-here>
```

### 2. Run the Services

Open a terminal in the `express-server` project root and run:

```bash
docker-compose up --build
```

To Stop:
Press `Ctrl + C` in the terminal, and then run:

```bash
docker-compose down
```

## Project Structure

The folder structure of this app is explained below:

```text
├── dist/                     # Compiled JavaScript output from TypeScript
├── node_modules/             # Project dependencies
├── docs/                     # Documentation files
│   ├── RBAC_DOCUMENTATION.md # Comprehensive RBAC documentation
│   └── RBAC_QUICKSTART.md    # Quick reference for RBAC
├── src/                      # Main source code directory
│   ├── config/               # Environment variables, DB connection, Swagger config
│   │   ├── database.config.ts
│   │   └── swagger.config.ts
│   ├── controllers/          # Request handlers (HTTP layer)
│   │   ├── auth.controller.ts
│   │   ├── role.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/          # Custom Express middleware
│   │   ├── auth.middleware.ts      # Authentication & RBAC middleware
│   │   └── error-handler.middleware.ts
│   ├── models/               # Mongoose schemas and models
│   │   ├── permission.model.ts
│   │   ├── role.model.ts
│   │   └── user.model.ts
│   ├── routes/               # API route definitions
│   │   ├── auth.route.ts
│   │   ├── role.route.ts
│   │   ├── user.route.ts
│   │   └── index.ts
│   ├── repositories/         # Data access layer (Repository Pattern)
│   │   ├── permission.repository.ts
│   │   ├── role.repository.ts
│   │   └── user.repository.ts
│   ├── services/             # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── role.service.ts
│   │   └── user.service.ts
│   ├── seeders/              # Database seeders
│   │   └── rbac.seeder.ts
│   ├── types/                # TypeScript type definitions
│   │   └── rbac.types.ts
│   ├── utils/                # Utility functions and helpers
│   │   ├── app-error.ts           # Custom error class
│   │   ├── catch-async.ts         # Async error handler wrapper
│   │   ├── constans.ts            # Application constants
│   │   ├── encryption.ts          # Password encryption utilities
│   │   ├── jwt.ts                 # JWT token utilities
│   │   └── response-builder.ts    # Standardized API responses
│   ├── app.ts                # Express application setup
│   └── server.ts             # Server entry point
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore configuration
├── docker-compose.yml        # Docker Compose configuration
├── dockerfile                # Docker container configuration
├── nodemon.json              # Nodemon configuration for development
├── package.json              # Project dependencies and scripts
├── prettier.config.ts        # Code formatting configuration
├── tsconfig.json             # TypeScript compiler configuration
└── README.md                 # Project documentation
```

## Building the project

### Configuring TypeScript compilation

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "baseUrl": "./src",
    "outDir": "./dist",
    "sourceMap": true,
    "noImplicitAny": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts", "test", "node_modules"]
}
```

### Running the build

All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script  | Description                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------- |
| `dev`       | Runs development server with hot reload using nodemon. Can be invoked with `npm run dev`       |
| `build`     | Compiles TypeScript to JavaScript in the dist/ folder. Can be invoked with `npm run build`     |
| `start`     | Runs the compiled production build from dist/. Can be invoked with `npm start`                 |
| `seed:rbac` | Seeds the database with default roles and permissions. Can be invoked with `npm run seed:rbac` |
| `db:seed`   | Alias for seed:rbac. Can be invoked with `npm run db:seed`                                     |
| `test`      | Runs test suite (if configured)                                                                |

### Using the debugger in VS Code

Node.js debugging in VS Code is easy to setup and even easier to use.
Press `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run API Server",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

## Swagger 📖 API Documentation

This project uses Swagger (OpenAPI) to generate live, interactive API documentation. This allows developers to easily visualize and interact with the API's endpoints without having to read through the source code.
The documentation is automatically generated from JSDoc comments written directly above the route definitions in the code.

### API Response Format

All API responses follow a consistent structure:

**Success Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    // Response data here
  },
  "errorMessage": null
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "errorMessage": "Error message here"
}
```

**Authentication Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "username": "johndoe",
      "roles": ["user"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpcy1pcy1hLWZha2UtcmVmcmVzaC10b2tlbg=="
  },
  "errorMessage": null
}
```

### HTTP Status Codes

| Code | Description                            |
| ---- | -------------------------------------- |
| 200  | OK - Request successful                |
| 201  | Created - Resource created             |
| 400  | Bad Request - Invalid input            |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Insufficient permissions   |
| 404  | Not Found - Resource not found         |
| 500  | Internal Server Error                  |

### How to Document New Endpoints

To ensure your new API endpoints appear in the Swagger documentation, you must add a special JSDoc comment block (/\*_..._/) directly above your Express route handler.

### JSDoc Schema Cheatsheet

Here is a template and an explanation of the most common tags.
Full Example (for a POST /users route):

```TypeScript
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
    router.get('/users', isAuthenticated, userController.getAllUsers);
```

#### Key Tags Explained

- `@swagger`: **Required.** Tells `swagger-jsdoc` to parse this comment block.
- `/users`: **(YAML)** The path of your API endpoint. This must be nested under `@swagger`.
- `post:`: **(YAML)** The HTTP method (`get`, `post`, `put`, `patch`, `delete`).
- `summary: Create a new user`: A short, human-readable description of what the endpoint does.
- `tags: [Users]`: A list of tags used to group endpoints in the UI. This is highly recommended for organization.
- `requestBody:`: Describes the payload sent _to_ the API.
  - `required: true`: Specifies if the body is mandatory.
  - `content: application/json: schema:`: Describes the format and structure of the body.
    - `properties:`: Defines the fields within the object.
    - `example:`: Provides an example value that shows up in the UI.
- `responses:`: Defines all possible HTTP responses.
  - `"201":`: The HTTP status code (must be in quotes).
  - `description:`: A human-readable description of this response.
  - `content: ... schema:`: (Optional) Describes the structure of the data returned in this response.

## RBAC (Role-Based Access Control) 🔐

This project implements a comprehensive RBAC system following SOLID principles for secure and flexible access control.

### RBAC Features

- ✅ **5 Predefined Roles**: super_admin, admin, manager, user, guest
- ✅ **19 Granular Permissions**: Fine-grained control over resources
- ✅ **Flexible Middleware**: Easy-to-use permission and role checks
- ✅ **SOLID Principles**: Clean, maintainable, and extensible architecture
- ✅ **TypeScript Support**: Full type safety
- ✅ **Database Seeder**: Quick setup with default configurations

### Quick Setup

1.**Seed RBAC Data** (First time only):

```bash
npm run seed:rbac
```

2.**Create Admin User**:

```bash
POST /api/auth/signup
{
  "email": "admin@example.com",
  "password": "SecurePass123",
  "username": "admin",
  "roles": ["admin"]
}
```

3.**Protect Routes**:

```typescript
import { requirePermission, requireRole } from './middlewares/auth.middleware'
import { Permission, Role } from './types/rbac.types'

// Require specific permission
router.get(
  '/users',
  isAuthenticated,
  requirePermission(Permission.USER_LIST),
  controller.getAllUsers,
)

// Require specific role
router.delete(
  '/users/:id',
  isAuthenticated,
  requireRole(Role.ADMIN),
  controller.deleteUser,
)
```

### Available Roles & Permissions

#### Roles Overview

| Role            | Description                    | Key Permissions                              |
| --------------- | ------------------------------ | -------------------------------------------- |
| **super_admin** | Full system access             | All 19 permissions (complete system control) |
| **admin**       | User and role management       | User CRUD, Role read/list                    |
| **manager**     | Limited user management        | User read/update/list                        |
| **user**        | Standard user with self-access | Self read/update                             |
| **guest**       | Read-only access               | Self read only                               |

#### All Available Permissions

**User Permissions:**

- `user:create` - Create new users
- `user:read` - Read any user's information
- `user:update` - Update any user's information
- `user:delete` - Delete users
- `user:list` - List all users

**Role Permissions:**

- `role:create` - Create new roles
- `role:read` - Read role information
- `role:update` - Update role information
- `role:delete` - Delete roles
- `role:list` - List all roles
- `role:assign` - Assign roles to users

**Permission Permissions:**

- `permission:create` - Create new permissions
- `permission:read` - Read permission information
- `permission:update` - Update permission information
- `permission:delete` - Delete permissions
- `permission:list` - List all permissions
- `permission:assign` - Assign permissions to roles

**Self Permissions:**

- `self:read` - Read own user information
- `self:update` - Update own user information

### Middleware Examples

```typescript
// Single permission
requirePermission(Permission.USER_READ)

// Multiple permissions (any)
requireAnyPermission([Permission.USER_READ, Permission.USER_UPDATE])

// Multiple permissions (all)
requireAllPermissions([Permission.USER_CREATE, Permission.ROLE_ASSIGN])

// Role check
requireRole(Role.ADMIN)

// Multiple roles (any)
requireAnyRole([Role.SUPER_ADMIN, Role.ADMIN])

// Ownership or admin
requireOwnershipOrAdmin('userId')

// Ownership or permission
requireOwnershipOrPermission('userId', Permission.USER_UPDATE)
```

### Documentation

- 📖 **[Full Documentation](./docs/RBAC_DOCUMENTATION.md)** - Comprehensive guide with architecture details
- 🚀 **[Quick Reference](./docs/RBAC_QUICKSTART.md)** - Quick start guide and common patterns

### RBAC API Endpoints

#### Authentication Endpoints

- `POST /api/auth/signup` - Register a new user with optional roles
  - Request body: `{ email, password, username, firstname, lastname, image?, roles? }`
  - Response: User object with access/refresh tokens

- `POST /api/auth/signin` - Login with email and password
  - Request body: `{ email, password }`
  - Response: User object with access/refresh tokens

- `POST /api/auth/signout` - Logout and invalidate refresh token
  - Request body: `{ refreshToken }`
  - Response: Success message

- `POST /api/auth/refresh` - Refresh access token
  - Cookie: `refreshToken` (httpOnly)
  - Response: New access token

- `GET /api/auth/me` - Get authenticated user profile
  - Requires: Bearer token
  - Response: User object with roles

#### User Management Endpoints

- `GET /api/users` - List all users (requires `USER_LIST` permission)
  - Requires: Bearer token + `USER_LIST` permission
  - Query params: `page`, `limit`
  - Response: Paginated user list

- `GET /api/users/:id` - Get user by ID (requires `USER_READ` permission or ownership)
  - Requires: Bearer token + (`USER_READ` permission OR user is owner)
  - Response: User object

- `DELETE /api/users/:id` - Delete user (Admin only)
  - Requires: Bearer token + (`SUPER_ADMIN` OR `ADMIN` role) + `USER_DELETE` permission
  - Response: Success message

#### Role Management Endpoints

- `GET /api/roles` - List all roles (requires `ROLE_LIST` permission)
  - Requires: Bearer token + `ROLE_LIST` permission
  - Response: Array of role objects

- `GET /api/roles/:name` - Get role details (requires `ROLE_READ` permission)
  - Requires: Bearer token + `ROLE_READ` permission
  - Response: Role object with permissions

- `POST /api/roles` - Create new role (Super Admin only)
  - Requires: Bearer token + `SUPER_ADMIN` role + `ROLE_CREATE` permission
  - Request body: `{ name, description, permissions }`
  - Response: Created role object

- `PUT /api/roles/:name/permissions` - Update role permissions (Super Admin only)
  - Requires: Bearer token + `SUPER_ADMIN` role + `PERMISSION_ASSIGN` permission
  - Request body: `{ permissions }` (replaces all permissions)
  - Response: Updated role object

- `POST /api/roles/:name/permissions/add` - Add permissions to role (Super Admin only)
  - Requires: Bearer token + `SUPER_ADMIN` role + `PERMISSION_ASSIGN` permission
  - Request body: `{ permissions }` (adds to existing)
  - Response: Updated role object

- `POST /api/roles/:name/permissions/remove` - Remove permissions from role (Super Admin only)
  - Requires: Bearer token + `SUPER_ADMIN` role + `PERMISSION_ASSIGN` permission
  - Request body: `{ permissions }` (removes specified)
  - Response: Updated role object

- `DELETE /api/roles/:name` - Delete role (Super Admin only)
  - Requires: Bearer token + `SUPER_ADMIN` role + `ROLE_DELETE` permission
  - Response: Success message

## Common Issues

### npm install fails

The current solution has an example for using a private npm repository. if you want to use the public npm repository, remove the .npmrc file.

### RBAC: "No roles assigned" error

Run the RBAC seeder to create default roles and permissions:

```bash
npm run seed:rbac
```
