import { UserRepository } from './repositories/user.repository'
import { RoleRepository } from './repositories/role.repository'
import { AuthService } from './services/auth.service'
import { RbacService } from './services/rbac.service'
import { UserService } from './services/user.service'
import { RoleService } from './services/role.service'
import { AuthController } from './controllers/auth.controller'
import { UserController } from './controllers/user.controller'
import { RoleController } from './controllers/role.controller'

const userRepository = new UserRepository()
const roleRepository = new RoleRepository()

export const rbacService = new RbacService(roleRepository)
export const authService = new AuthService(roleRepository, userRepository)
export const userService = new UserService(userRepository)
export const roleService = new RoleService(roleRepository)

export const authController = new AuthController(authService)
export const userController = new UserController(userService)
export const roleController = new RoleController(roleService)
