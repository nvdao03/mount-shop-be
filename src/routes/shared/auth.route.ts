import { Router } from 'express'
import {
  changePasswordController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  verifyForgotPasswordController
} from '~/controllers/auth.controller'
import {
  accessTokenValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordValidator,
  verifyUserValidator
} from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Authentication ---
router.post('/register', registerValidator, wrapHandler(registerController))
router.post('/login', loginValidator, wrapHandler(loginController))
router.post('/logout', accessTokenValidator, refreshTokenValidator, wrapHandler(logoutController))

// --- Change Password ---
router.post(
  '/change-password',
  accessTokenValidator,
  verifyUserValidator,
  changePasswordValidator,
  wrapHandler(changePasswordController)
)

// --- Forgot Password ---
router.post('/forgot-password', forgotPasswordValidator, wrapHandler(forgotPasswordController))
router.post('/verify-forgot-password', verifyForgotPasswordValidator, wrapHandler(verifyForgotPasswordController))
router.post('/reset-password', resetPasswordValidator, wrapHandler(resetPasswordController))

export default router
