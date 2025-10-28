import { Router } from 'express'
import { addAddressController, getAddressesController } from '~/controllers/address.controller'
import { addAddressValidator } from '~/middlewares/address.middleware'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Add Address ---
router.post('/', accessTokenValidator, verifyUserValidator, addAddressValidator, wrapHandler(addAddressController))

// --- Get Addresses ---
router.get('/', accessTokenValidator, verifyUserValidator, wrapHandler(getAddressesController))

export default router
