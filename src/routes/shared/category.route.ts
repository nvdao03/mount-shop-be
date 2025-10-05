import { Router } from 'express'
import { getCategoryAllController } from '~/controllers/category.controller'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

router.get('/', wrapHandler(getCategoryAllController))

export default router
