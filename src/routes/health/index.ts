import { Router } from 'express'
import healthRoute from './health.route'

const healthRouter = Router()

healthRouter.use('/', healthRoute)

export default healthRouter
