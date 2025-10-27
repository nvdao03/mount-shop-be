import { Router } from 'express'
import userRouter from './user.route'
import commentRouter from './comment.route'
import cartRouter from './cart.route'

const usersRouter = Router()

usersRouter.use('/', userRouter)
userRouter.use('/comments', commentRouter)
userRouter.use('/carts', cartRouter)

export default usersRouter
