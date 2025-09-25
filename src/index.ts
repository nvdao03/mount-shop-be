import express from 'express'
import './configs/env.config'

const PORT = process.env.PORT || 4000

const app = express()

// --- Middlewares ---
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
