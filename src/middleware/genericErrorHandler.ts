import { ErrorRequestHandler } from "express"

const genericErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log('An error occured!')
  console.log(`PATH: "${req.path}"`)
  console.log(err)
  res.status(500).send("Internal Server Error")
}

export default genericErrorHandler