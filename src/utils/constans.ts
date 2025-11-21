export const HTTP_OK = 200
export const HTTP_BAD_REQUEST = 400
export const HTTP_UNAUTHORIZED = 401
export const HTTP_FORBIDDEN = 403
export const HTTP_NOT_FOUND = 404
export const HTTP_INTERNAL_SERVER_ERROR = 500

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
