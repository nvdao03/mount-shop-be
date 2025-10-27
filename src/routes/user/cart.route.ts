import { Router } from 'express'
import { addCartController } from '~/controllers/cart.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { addCartValidator } from '~/middlewares/cart.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Add cart ---
router.post('/', accessTokenValidator, verifyUserValidator, addCartValidator, wrapHandler(addCartController))

export default router
