import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/auth.controller'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Authentication ---
router.post('/register', registerValidator, wrapHandler(registerController))
router.post('/login', loginValidator, wrapHandler(loginController))
router.post('/logout', accessTokenValidator, refreshTokenValidator, wrapHandler(logoutController))

export default router
