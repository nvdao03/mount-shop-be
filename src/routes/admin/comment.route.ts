import { Router } from 'express'
import { getCommentAddController } from '~/controllers/comment.controller'
import { accessTokenValidator, verifyAdminValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

router.get('/', accessTokenValidator, verifyUserValidator, verifyAdminValidator, wrapHandler(getCommentAddController))

export default router
