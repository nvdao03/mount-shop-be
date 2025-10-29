import { Router } from 'express'
import { addOrderController, getOrdersController } from '~/controllers/order.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { addOrderValidator } from '~/middlewares/order.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Add Order ---
router.post('/', accessTokenValidator, verifyUserValidator, addOrderValidator, wrapHandler(addOrderController))

// --- Get Orders ---
router.get('/', accessTokenValidator, verifyUserValidator, wrapHandler(getOrdersController))

export default router
