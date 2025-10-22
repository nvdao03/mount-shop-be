import { Router } from 'express'
import { deleteUserController, getUsersController } from '~/controllers/user.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Get Users ---
router.get('/', accessTokenValidator, verifyUserValidator, verifyAdminValidator, wrapHandler(getUsersController))
// --- Delete User ---
router.delete(
  '/:user_id',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  wrapHandler(deleteUserController)
)

export default router
