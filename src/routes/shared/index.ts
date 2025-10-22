import { Router } from 'express'
import productRouter from './product.route'
import authRouter from './auth.route'
import mediaRouter from './media.route'
import categoryRouter from './category.route'
import commentRouter from './comment.route'

const sharedRouter = Router()

sharedRouter.use('/auth', authRouter)
sharedRouter.use('/media', mediaRouter)
sharedRouter.use('/categories', categoryRouter)
sharedRouter.use('/products', productRouter)
sharedRouter.use('/comments', commentRouter)

export default sharedRouter
