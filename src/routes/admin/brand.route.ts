import { Router } from 'express'
import { addBrandController } from '~/controllers/brand.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { addBrandValidator } from '~/middlewares/brand.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

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
router.put('/:brand_id')

// --- Delete Brand ---
router.delete('/:brand_id')

// --- Get Brand List ---
router.get('/')

// --- Get Brand Detail ---
router.get('/:brand_id')

export default router
