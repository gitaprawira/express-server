// HTTP Status Codes
export const HTTP_OK = 200
export const HTTP_CREATED = 201
export const HTTP_BAD_REQUEST = 400
export const HTTP_UNAUTHORIZED = 401
export const HTTP_FORBIDDEN = 403
export const HTTP_NOT_FOUND = 404
export const HTTP_INTERNAL_SERVER_ERROR = 500

// General messages
export const MESSAGE_NOT_FOUND = 'Data Not found!'
export const MESSAGE_FORBIDDEN = 'Forbidden!'
export const MESSAGE_UNEXPECTED_ERROR = 'Unexpected Error Occurred!'
export const MESSAGE_IS_EXISTS = 'Email is Exists!'
export const MESSAGE_INTERNAL_SERVER_ERROR = 'Internal Server Error!'

// Authentication messages
export const MESSAGE_EMAIL_PASSWORD_REQUIRED = 'Email and password are required'
export const MESSAGE_INVALID_INPUT_TYPES = 'Invalid input types'
export const MESSAGE_INVALID_CREDENTIALS = 'Invalid credentials'
export const MESSAGE_EMAIL_USERNAME_PASSWORD_REQUIRED = 'Email, password, and username are required'
export const MESSAGE_INVALID_EMAIL_FORMAT = 'Invalid email format'
export const MESSAGE_PASSWORD_MIN_LENGTH = 'Password must be at least 8 characters long'
export const MESSAGE_USERNAME_MIN_LENGTH = 'Username must be at least 3 characters long'
export const MESSAGE_USER_ALREADY_EXISTS = 'User with this email already exists'
export const MESSAGE_INVALID_REFRESH_TOKEN = 'Invalid refresh token'
export const MESSAGE_LOGOUT_SUCCESS = 'Successfully logged out'
export const MESSAGE_JWT_REFRESH_SECRET_NOT_CONFIGURED = 'JWT_REFRESH_SECRET is not configured'
export const MESSAGE_INVALID_EXPIRED_REFRESH_TOKEN = 'Invalid or expired refresh token'

// Log messages
export const LOG_AUTHENTICATION_ERROR = 'Authentication error:'
export const LOG_REGISTRATION_ERROR = 'Registration error:'
export const LOG_SIGNOUT_ERROR = 'Sign out error:'
export const LOG_TOKEN_REFRESH_ERROR = 'Token refresh error:'
export const LOG_AUTH_MIDDLEWARE_ERROR = 'Auth middleware error:'

// Middleware messages
export const MESSAGE_UNAUTHORIZED = 'Unauthorized access'
export const MESSAGE_INVALID_TOKEN = 'Invalid or expired token'
export const MESSAGE_SERVER_CONFIG_ERROR = 'Server configuration error'
export const MESSAGE_AUTHENTICATION_FAILED = 'Authentication failed'
export const MESSAGE_AUTHORIZATION_CHECK_FAILED = 'Authorization check failed'
export const MESSAGE_OWNERSHIP_CHECK_FAILED = 'Ownership check failed'
export const MESSAGE_JWT_SECRET_NOT_CONFIGURED = 'JWT_SECRET is not configured'

// RBAC messages
export const MESSAGE_ROLE_NOT_FOUND = 'Required role not found'
export const MESSAGE_PERMISSION_NOT_FOUND = 'Required permission not found'
export const MESSAGE_INSUFFICIENT_PERMISSIONS = 'Insufficient permissions to perform this action'
export const MESSAGE_NO_ROLES_ASSIGNED = 'No roles assigned to user'
export const MESSAGE_INVALID_ROLE = 'Invalid role specified'
export const MESSAGE_INVALID_PERMISSION = 'Invalid permission specified'
export const MESSAGE_ROLE_ALREADY_EXISTS = 'Role already exists'
export const MESSAGE_PERMISSION_ALREADY_EXISTS = 'Permission already exists'
export const MESSAGE_ROLE_ASSIGNMENT_FAILED = 'Failed to assign role'
export const MESSAGE_PERMISSION_ASSIGNMENT_FAILED = 'Failed to assign permission'
export const LOG_AUTHORIZATION_ERROR = 'Authorization error:'
export const LOG_RBAC_ERROR = 'RBAC error:'

// User service messages
export const MESSAGE_FAILED_TO_FETCH_USERS = 'Failed to fetch users'
export const MESSAGE_FAILED_TO_FETCH_USER = 'Failed to fetch user'
export const MESSAGE_FAILED_TO_DELETE_USER = 'Failed to delete user'
export const LOG_ERROR_FETCHING_USERS = 'Error fetching users:'
export const LOG_ERROR_FETCHING_USER = 'Error fetching user with id'
export const LOG_ERROR_DELETING_USER = 'Error deleting user with id'

// Role controller messages
export const MESSAGE_ROLE_DELETED_SUCCESS = 'Role deleted successfully'

// Refresh token messages
export const MESSAGE_REFRESH_TOKEN_NOT_FOUND = 'Refresh token not found.'
