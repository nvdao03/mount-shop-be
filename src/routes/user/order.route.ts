import { Router } from 'express'
import {
  addOrderController,
  getOrderDetailController,
  getOrdersController,
  updateOrderCancelController
} from '~/controllers/order.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { addOrderValidator, checkIdOrderValidator, updataOrderCancelValidator } from '~/middlewares/order.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Add Order ---
router.post('/', accessTokenValidator, verifyUserValidator, addOrderValidator, wrapHandler(addOrderController))

// --- Get Orders ---
router.get('/', accessTokenValidator, wrapHandler(getOrdersController))

// --- Get Order Detail ---
router.get('/:order_id', accessTokenValidator, checkIdOrderValidator, wrapHandler(getOrderDetailController))

// --- Update Order Cancel ---
router.put(
  '/:order_id',
  accessTokenValidator,
  verifyUserValidator,
  updataOrderCancelValidator,
  wrapHandler(updateOrderCancelController)
)

export default router
