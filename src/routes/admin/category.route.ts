import { Router } from 'express'
import {
  addCategoryController,
  deleteCategoryController,
  getCategoryDetailController,
  updateCategoryController
} from '~/controllers/category.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { addCategoryValidator, checkCategoryId, updateCategoryValidator } from '~/middlewares/category.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Add Category ---
router.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  addCategoryValidator,
  wrapHandler(addCategoryController)
)

// --- Update Category ---
router.put(
  '/:category_id',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  checkCategoryId,
  updateCategoryValidator,
  wrapHandler(updateCategoryController)
)

// --- Delete Category ---
router.delete(
  '/:category_id',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  checkCategoryId,
  wrapHandler(deleteCategoryController)
)

// --- Get Category Detail ---
router.get(
  '/:category_id',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  checkCategoryId,
  wrapHandler(getCategoryDetailController)
)

export default router
