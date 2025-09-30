import { Router } from 'express'
import userRouter from './user.route'
import productRouter from './product.route'

const adminRouter = Router()

adminRouter.use('/users', userRouter)
adminRouter.use('/products', productRouter)

export default adminRouter
