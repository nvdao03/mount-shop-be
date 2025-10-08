import { Router } from 'express'
import { getBrandsByCategoryIdController, getCategoriesController } from '~/controllers/category.controller'
import { checkCategoryId } from '~/middlewares/category.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Get Categories ---
router.get('/', wrapHandler(getCategoriesController))

// --- Get All Brand By Category ---
router.get('/:category_id/brands', checkCategoryId, wrapHandler(getBrandsByCategoryIdController))

export default router
