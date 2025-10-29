import { Router } from 'express'
import { addOrderController } from '~/controllers/order.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { addOrderValidator } from '~/middlewares/order.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Add Order ---
router.post('/', accessTokenValidator, verifyUserValidator, addOrderValidator, wrapHandler(addOrderController))

export default router
