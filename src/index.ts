import express from 'express'
import connectToDatabase from './lib/db'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { CLIENT_ORIGIN, NODE_ENV, PORT } from './constants/env'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.status(200).json({
    status: "ok"
  })
})

app.listen(PORT, async () => {
  console.log(`[NODE_ENV=${NODE_ENV}] App listening on port ${PORT}`)
  await connectToDatabase()
})