import { Router } from 'express'
import { getProductDetailController } from '~/controllers/product.controller'
import { checkProductId } from '~/middlewares/product.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Get Product Detail ---
router.get('/:product_id', checkProductId, wrapHandler(getProductDetailController))

// --- Get Product List ---
router.get('/')

export default router
