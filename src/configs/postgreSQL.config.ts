import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../db/schema'
import './env.config'

const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(isProduction
    ? {
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {})
})

export const db = drizzle(pool, { schema })

export const connectDB = async () => {
  try {
    await pool.connect()
    console.log('Connected to PostgreSQL')
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error)
    process.exit(1)
  }
}
