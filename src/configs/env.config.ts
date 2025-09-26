import path from 'path'
import { config } from 'dotenv'

const envFile = `.env.${process.env.NODE_ENV || 'development'}`
config({ path: path.resolve(envFile) })
