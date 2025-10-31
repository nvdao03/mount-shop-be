import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 250,
  message: 'Too many requests, please try again later.',
  standardHeaders: 'draft-8',
  legacyHeaders: false
})

export default limiter
