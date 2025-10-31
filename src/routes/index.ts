import { Router } from 'express'
import adminRouter from '~/routes/admin'
import sharedRouter from '~/routes/shared'
import userRouter from '~/routes/user'
import healthRouter from '~/routes/health'

const router = Router()

// --- Admin Router ---
router.use('/admin', adminRouter)

// --- User Router ---
router.use('/user', userRouter)

// --- Public Router ---
router.use('/', sharedRouter)

// --- Health Router Running Server and Database don't sleep ---
router.use('/health', healthRouter)

export default router
