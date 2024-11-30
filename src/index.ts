import express from 'express'
import connectToDatabase from './lib/db'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { CLIENT_ORIGIN, NODE_ENV, PORT } from './constants/env'
import { OK } from './constants/http'

import genericErrorHandler from './middleware/genericErrorHandler'
import authRoutes from './routes/auth.route'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.status(OK).json({
    status: "ok"
  })
})

app.use('/auth', authRoutes)

app.use(genericErrorHandler)

app.listen(PORT, async () => {
  console.log(`[NODE_ENV=${NODE_ENV}] App listening on port ${PORT}`)
  await connectToDatabase()
})