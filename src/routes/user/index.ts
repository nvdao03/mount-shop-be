import { Router } from 'express'
import userRouter from './user.route'

const usersRouter = Router()

usersRouter.use('/', userRouter)

export default usersRouter
