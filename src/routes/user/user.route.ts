import { Router } from 'express'
import { getProfileController } from '~/controllers/user.controller'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Get Profile ---
router.get('/profile', accessTokenValidator, wrapHandler(getProfileController))

export default router
