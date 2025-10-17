import { Router } from 'express'
import {
  addProductController,
  deleteProductController,
  updateProductController
} from '~/controllers/product.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { addProductValidator, checkProductId, updateProductValidator } from '~/middlewares/product.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Add Product ---
router.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  addProductValidator,
  wrapHandler(addProductController)
)

// --- Update Product ---
router.put(
  '/:product_id',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  checkProductId,
  updateProductValidator,
  wrapHandler(updateProductController)
)

// --- Delete Product ---
router.delete(
  '/:product_id',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  checkProductId,
  wrapHandler(deleteProductController)
)

export default router
