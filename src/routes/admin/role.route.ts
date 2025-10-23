import { Router } from 'express'
import { getRolesController } from '~/controllers/role.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

router.get('/', accessTokenValidator, verifyUserValidator, verifyAdminValidator, wrapHandler(getRolesController))

export default router
