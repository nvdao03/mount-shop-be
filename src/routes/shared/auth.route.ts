import { Router } from 'express'
import {
  changePasswordController,
  forgotPasswordController,
  loginController,
  logoutController,
  oauthController,
  refreshTokenController,
  registerController,
  resetPasswordController,
  verifyEmailController,
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
  verifyEmailValidator,
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
router.put(
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

// --- Verify email ---
router.post('/verify-email', verifyEmailValidator, wrapHandler(verifyEmailController))

// --- Refresh token ---
router.post('/refresh-token', refreshTokenValidator, wrapHandler(refreshTokenController))

// --- Google Oauth ---
router.get('/oauth/google', wrapHandler(oauthController))

export default router
