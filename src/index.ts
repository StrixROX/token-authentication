import express from 'express'
import connectToDatabase from './lib/db'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { CLIENT_ORIGIN, NODE_ENV, PORT } from './constants/env'
import { OK } from './constants/http'

import genericErrorHandler from './middleware/genericErrorHandler'
import authRoutes from './routes/auth.route'
import authenticate from './middleware/authenticate'
import userRoutes from './routes/user.route'
import sessionRoutes from './routes/session.route'

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

// auth routes
app.use('/auth', authRoutes)

// protected routes
app.use('/user', authenticate, userRoutes)
app.use('/sessions', authenticate, sessionRoutes)

app.use(genericErrorHandler)

app.listen(PORT, async () => {
  console.log(`[NODE_ENV=${NODE_ENV}] App listening on port ${PORT}`)
  await connectToDatabase()
})