import { Router } from 'express'
import { addAddressController } from '~/controllers/address.controller'
import { addAddressValidator } from '~/middlewares/address.middleware'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

router.post('/', accessTokenValidator, verifyUserValidator, addAddressValidator, wrapHandler(addAddressController))

export default router
