import { Router } from 'express'
import authroute from './auth.route'
import userroute from './user.route'
import roleroute from './role.route'

const router = Router()

export default (): Router => {
  authroute(router)
  userroute(router)
  roleroute(router)
  return router
}
