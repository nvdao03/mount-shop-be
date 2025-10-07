import { Router } from 'express'
import { addProductController } from '~/controllers/product.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { addProductValidator } from '~/middlewares/product.middleware'
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

// --- Delete Product ---

// --- Get Product Detail ---

// --- Get Product List ---

export default router
