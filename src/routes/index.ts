import { Router } from 'express'
import fs from 'fs'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'
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

// --- Swagger doc ---
const file = fs.readFileSync('mount-shop-swagger.yaml', 'utf-8')
const swaggerDocument = YAML.parse(file)
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export default router
