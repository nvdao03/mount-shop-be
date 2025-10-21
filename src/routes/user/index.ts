import { Router } from 'express'
import userRouter from './user.route'
import commentRouter from './comment.route'

const usersRouter = Router()

usersRouter.use('/', userRouter)
userRouter.use('/comments', commentRouter)

export default usersRouter
