import { Router } from 'express'
import { getProductDetailController, getProductsController } from '~/controllers/product.controller'
import { checkProductId } from '~/middlewares/product.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Get Product Detail ---
router.get('/:product_id', checkProductId, wrapHandler(getProductDetailController))

// --- Get Products ---
router.get('/', wrapHandler(getProductsController))

export default router
