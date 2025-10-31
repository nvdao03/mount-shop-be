import { Router, Request, Response, NextFunction } from 'express'
import { db } from '~/configs/postgreSQL.config'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.execute('SELECT 1')

    return res.status(200).json({
      status: 'ok',
      message: 'Server and Database are running 🚀'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Server is running but cannot connect to Database ❌'
    })
  }
})

export default router
