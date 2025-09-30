import { Router } from 'express'
import adminRouter from '~/routes/admin'
import sharedRouter from '~/routes/shared'
import userRouter from '~/routes/user'

const router = Router()

// --- Admin Router ---
router.use('/admin', adminRouter)

// --- User Router ---
router.use('/user', userRouter)

// --- Public Router ---
router.use('/', sharedRouter)

export default router
