import { Router } from 'express'
import { handleUploadImageController } from '~/controllers/media.controller'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/auth.middleware'
import { wrapHandler } from '~/utils/wrapHanler'

const router = Router()

// --- Upload image ---
router.post('/upload-image', accessTokenValidator, verifyUserValidator, wrapHandler(handleUploadImageController))

export default router
