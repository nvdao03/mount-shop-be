import { Router } from 'express'
import userRouter from './user.route'
import productRouter from './product.route'
import brandRouter from './brand.route'
import categoryRouter from './category.route'
import commentRouter from './comment.route'

const adminRouter = Router()

adminRouter.use('/users', userRouter)
adminRouter.use('/brands', brandRouter)
adminRouter.use('/categories', categoryRouter)
adminRouter.use('/products', productRouter)
adminRouter.use('/comments', commentRouter)

export default adminRouter
