import { Router } from 'express'
import productRouter from './product.route'
import authRouter from './auth.route'
import mediaRouter from './media.route'

const sharedRouter = Router()

sharedRouter.use('/products', productRouter)
sharedRouter.use('/auth', authRouter)
sharedRouter.use('/media', mediaRouter)

export default sharedRouter
