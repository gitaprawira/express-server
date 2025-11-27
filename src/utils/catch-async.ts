import { Request, Response, NextFunction } from 'express'

/**
 * Higher-Order Function for Async Route Handler Error Handling
 * 
 * Wraps async controller functions to automatically catch errors
 * and pass them to Express error handling middleware, eliminating
 * the need for try-catch blocks in controllers.
 * 
 * This follows the DRY principle and ensures consistent error handling
 * across all async route handlers.
 * 
 * @example
 * router.get('/users', catchAsync(async (req, res, next) => {
 *   const users = await userService.getAllUsers()
 *   res.json({ success: true, data: users })
 * }))
 */
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}
