import { Router } from 'express'
import { getBrandsByCategoryIdController, getCategoryAllController } from '~/controllers/category.controller'
import { checkCategoryId } from '~/middlewares/category.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Get All Category ---
router.get('/', wrapHandler(getCategoryAllController))

// --- Get All Brand By Category ---
router.get('/:category_id/brands', checkCategoryId, wrapHandler(getBrandsByCategoryIdController))

export default router
