import { Router } from 'express'
import { addOrderController, getOrderDetailController, getOrdersController } from '~/controllers/order.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { addOrderValidator, checkIdOrderValidator } from '~/middlewares/order.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Add Order ---
router.post('/', accessTokenValidator, verifyUserValidator, addOrderValidator, wrapHandler(addOrderController))

// --- Get Orders ---
router.get('/', accessTokenValidator, verifyUserValidator, wrapHandler(getOrdersController))

// --- Get Order Detail ---
router.get(
  '/:order_id',
  accessTokenValidator,
  verifyUserValidator,
  checkIdOrderValidator,
  wrapHandler(getOrderDetailController)
)

export default router
