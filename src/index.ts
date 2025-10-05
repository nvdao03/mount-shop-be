import express from 'express'
import cors from 'cors'
import './configs/env.config'
import { connectDB } from './configs/postgreSQL.config'
import router from '~/routes'
import errorHandler from '~/middlewares/error.middleware'
import { initFolder } from '~/utils/file'
import path from 'path'
import { UPLOAD_IMAGE } from '~/constants/dir'

const PORT = process.env.PORT || 4000

const app = express()

// --- Middlewares ---
app.use(express.json())
app.use(cors())

// --- Init folder ---
initFolder()

// --- Routes ---
app.use('/api', router)

// --- Static Files ---
app.use('/images', express.static(path.resolve(UPLOAD_IMAGE)))

// --- Error Handler ---
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

async function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })

  await connectDB()
}

startServer()
