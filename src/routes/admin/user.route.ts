import { Router } from 'express'
import { getUsersController } from '~/controllers/user.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Get Users ---
router.get('/', accessTokenValidator, verifyUserValidator, verifyAdminValidator, wrapHandler(getUsersController))

export default router
