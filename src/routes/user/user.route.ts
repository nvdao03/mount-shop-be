import { Router } from 'express'
import { getProfileController, updateProfileController } from '~/controllers/user.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { updateProfileValidator } from '~/middlewares/user.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Get Profile ---
router.get('/profile', accessTokenValidator, wrapHandler(getProfileController))

// --- Update Profile ---
router.put(
  '/profile',
  accessTokenValidator,
  verifyUserValidator,
  updateProfileValidator,
  wrapHandler(updateProfileController)
)

export default router
