import { Router } from 'express'
import userRouter from './user.route'
import productRouter from './product.route'
import brandRouter from './brand.route'
import categoryRouter from './category.route'
import commentRouter from './comment.route'
import roleRouter from './role.route'

const adminRouter = Router()

adminRouter.use('/roles', roleRouter)
adminRouter.use('/users', userRouter)
adminRouter.use('/brands', brandRouter)
adminRouter.use('/categories', categoryRouter)
adminRouter.use('/products', productRouter)
adminRouter.use('/comments', commentRouter)

export default adminRouter
