import { Router } from 'express'
import {
  addBrandController,
  deleteBrandController,
  getBrandDetailController,
  getBrandsController,
  updateBrandController
} from '~/controllers/brand.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { addBrandValidator, checkBrandId, updateBrandValidator } from '~/middlewares/brand.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Get Brands ---
router.get('/', accessTokenValidator, verifyUserValidator, verifyAdminValidator, wrapHandler(getBrandsController))

// --- Add Brand ---
router.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  addBrandValidator,
  wrapHandler(addBrandController)
)

// --- Update Brand ---
router.put(
  '/:brand_id',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  checkBrandId,
  updateBrandValidator,
  wrapHandler(updateBrandController)
)

// --- Delete Brand ---
router.delete(
  '/:brand_id',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  checkBrandId,
  wrapHandler(deleteBrandController)
)

// --- Get Brand Detail ---
router.get(
  '/:brand_id',
  accessTokenValidator,
  verifyUserValidator,
  verifyAdminValidator,
  checkBrandId,
  wrapHandler(getBrandDetailController)
)

export default router
