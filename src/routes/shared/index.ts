import { Router } from 'express'
import productRouter from './product.route'
import authRouter from './auth.route'

const sharedRouter = Router()

sharedRouter.use('/products', productRouter)
sharedRouter.use('/auth', authRouter)

export default sharedRouter
