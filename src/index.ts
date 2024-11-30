import express from 'express'

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV

const app = express()

app.get('/', (req, res) => {
  res.status(200).json({
    status: "ok"
  })
})

app.listen(PORT, () => console.log(`[ENV=${NODE_ENV}] App listening on port ${PORT}`))