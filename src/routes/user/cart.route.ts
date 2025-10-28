import { Router } from 'express'
import {
  addCartController,
  deleteCartController,
  getCartsController,
  updateCartController
} from '~/controllers/cart.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import {
  addCartValidator,
  checkCartIdValidator,
  deleteCartValidator,
  updateCartValidator
} from '~/middlewares/cart.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Add Cart ---
router.post('/', accessTokenValidator, verifyUserValidator, addCartValidator, wrapHandler(addCartController))

// --- Get Carts ---
router.get('/', accessTokenValidator, wrapHandler(getCartsController))

// --- Delete Cart ---
router.delete(
  '/:cart_id',
  accessTokenValidator,
  verifyUserValidator,
  deleteCartValidator,
  wrapHandler(deleteCartController)
)

// --- Update Cart ---
router.put(
  '/:cart_id',
  accessTokenValidator,
  verifyUserValidator,
  checkCartIdValidator,
  updateCartValidator,
  wrapHandler(updateCartController)
)

export default router
