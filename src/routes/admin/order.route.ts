import { Router } from 'express'
import { getOrdersAllController, updateOrderController } from '~/controllers/order.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { updateOrderValidator } from '~/middlewares/order.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Get Orders ---
router.get('/', accessTokenValidator, verifyUserValidator, verifyAdminValidator, wrapHandler(getOrdersAllController))

// --- Update Order ---
router.put(
  '/:order_id',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  updateOrderValidator,
  wrapHandler(updateOrderController)
)

export default router
