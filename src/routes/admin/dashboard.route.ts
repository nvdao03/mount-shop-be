import { Router } from 'express'
import { getDashboardController } from '~/controllers/dashboard.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const rourer = Router()

rourer.get('/', accessTokenValidator, verifyUserValidator, verifyAdminValidator, wrapHandler(getDashboardController))

export default rourer
