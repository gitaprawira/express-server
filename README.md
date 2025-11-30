# Node.js Express TypeScript MongoDB Boilerplate

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust and scalable boilerplate for building RESTful APIs using Node.js, Express, TypeScript, and MongoDB. This project provides a solid foundation with a structured setup, ready for you to build your application's features.

---

## Features

- **TypeScript Ready**: Full TypeScript support for type safety and better developer experience.
- **Express.js Server**: Fast and minimalist web framework for Node.js.
- **MongoDB Integration**: Uses Mongoose for elegant MongoDB object modeling.
- **Environment Variables**: Centralized configuration using `.env` files.
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
git clone [https://github.com/gitaprawira/express-server](https://github.com/gitaprawira/express-server)
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
# .env
MONGODB_URL=mongodb://localhost:27017/soloware_pos
PORT=8080
```

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

- API Document endpoints

  swagger-ui Endpoint : [Swagger UI endpoint](http://localhost:8080/api-docs)

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
├── src/                      # Main source code directory
│   ├── config/               # Environment variables, DB connection, Swagger config
│   ├── controllers/          # Entry point for Request (HTTP layer)
│   ├── middlewares/          # Custom Express middleware (e.g., auth, logging)
│   ├── models/               # Mongoose schemas and models for MongoDB
│   ├── routes/               # Defines API routes and connects them to controllers
│   ├── repositories/         # Data Access (The interface to Mongoose)
│   ├── services/             # Business Logic (The "Brain")
│   ├── utils/                # Reusable utility functions (e.g., error handlers)
│   ├── app.ts                # Express App setup
│   └── server.ts             # Main server entry point (configures and starts Express)
├── .env                      # Environment variables (ignored by Git)
├── .env.example              # Example template for environment variables
├── .gitignore                # Specifies files for Git to ignore
├── package.json              # Project metadata and scripts
├── tsconfig.json             # TypeScript compiler options
├── pull_request_template.md  # Template for creating pull request
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

| Npm Script | Description                                                                           |
| ---------- | ------------------------------------------------------------------------------------- |
| `dev`      | Runs full build before starting all watch tasks. Can be invoked with `npm run dev`    |
| `build`    | Rund Build and replacing files into dist/ folder. Can be invoked with `npm run build` |
| `start`    | Runs full build and runs node on dist/index.js. Can be invoked with `npm start`       |
| `test`     | Runs build and run tests using mocha                                                  |

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
import { requirePermission, requireRole } from './middlewares/rbac.middleware'
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

| Role            | Description             | Key Permissions       |
| --------------- | ----------------------- | --------------------- |
| **super_admin** | Full system access      | All permissions       |
| **admin**       | User management         | User CRUD, Role read  |
| **manager**     | Limited user management | User read/update/list |
| **user**        | Self management         | Self read/update      |
| **guest**       | Read-only               | Self read only        |

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

#### Roles Management

- `GET /api/roles` - List all roles (requires ROLE_LIST permission)
- `GET /api/roles/:name` - Get role details (requires ROLE_READ permission)
- `POST /api/roles` - Create new role (Super Admin only)
- `PUT /api/roles/:name/permissions` - Update role permissions (Super Admin only)
- `DELETE /api/roles/:name` - Delete role (Super Admin only)

#### User Authentication with Roles

- `POST /api/auth/signup` - Register with optional roles parameter
- `POST /api/auth/signin` - Login (returns user with roles)

## Common Issues

### npm install fails

The current solution has an example for using a private npm repository. if you want to use the public npm repository, remove the .npmrc file.

### RBAC: "No roles assigned" error

Run the RBAC seeder to create default roles and permissions:

```bash
npm run seed:rbac
```
