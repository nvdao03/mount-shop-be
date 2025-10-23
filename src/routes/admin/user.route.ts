import { Router } from 'express'
import {
  addUserController,
  deleteUserController,
  getUsersController,
  updateUserRoleController
} from '~/controllers/user.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { updateUserRoleValidator } from '~/middlewares/user.middleware'
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

// --- Update User Role ---
router.put(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  updateUserRoleValidator,
  wrapHandler(updateUserRoleController)
)

// --- Add User ---
router.post('/', accessTokenValidator, verifyUserValidator, verifyAdminValidator, wrapHandler(addUserController))

export default router
