import { Router } from 'express'
import { getCommentsController } from '~/controllers/comment.controller'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Get Comments ---
router.get('/:product_id', wrapHandler(getCommentsController))

export default router
