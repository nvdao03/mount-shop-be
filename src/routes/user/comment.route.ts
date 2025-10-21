import { Router } from 'express'
import { addCommentController, deleteCmmentController } from '~/controllers/comment.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { addCommentValidator, deleteCommnetValidator } from '~/middlewares/comment.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Add Comment ---
router.post('/', accessTokenValidator, verifyUserValidator, addCommentValidator, wrapHandler(addCommentController))

// --- Delete Comment ---
router.delete(
  '/:comment_id',
  accessTokenValidator,
  verifyUserValidator,
  deleteCommnetValidator,
  wrapHandler(deleteCmmentController)
)

// --- Update Comment ---
router.put('/:comment_id')

// --- Get Comments ---
router.get('/')

export default router
