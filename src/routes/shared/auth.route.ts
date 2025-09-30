import { Router } from 'express'
import { loginController, registerController } from '~/controllers/auth.controller'
import { loginValidator, registerValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Authentication ---
router.post('/register', registerValidator, wrapHandler(registerController))
router.post('/login', loginValidator, wrapHandler(loginController))

export default router
