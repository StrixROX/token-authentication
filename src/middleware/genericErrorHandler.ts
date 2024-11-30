import { ErrorRequestHandler, Response } from "express"
import { z } from "zod"
import { BAD_REQUEST } from "../constants/http"

const handleZodError = (res: Response, err: z.ZodError) => {
  const errors = err.issues.map(err => ({
    path: err.path.join("."),
    message: err.message
  }))

  return res.status(BAD_REQUEST).json({
    message: JSON.parse(err.message),
    errors
  })
}

const genericErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log('An error occured!')
  console.log(`PATH: "${req.path}"`)
  console.log(err)

  if (err instanceof z.ZodError) {
    handleZodError(res, err)
  }
  else {
    res.status(500).send("Internal Server Error")
  }

}

export default genericErrorHandler