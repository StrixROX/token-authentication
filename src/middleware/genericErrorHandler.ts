import { ErrorRequestHandler, Response } from "express"
import { z } from "zod"
import { BAD_REQUEST } from "../constants/http"
import AppError from "../utils/AppError"
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookies"

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

const handleAppError = (res: Response, err: AppError) => {
  return res.status(err.statusCode).json({
    message: err.message,
    errorCode: err.errorCode
  })
}

const genericErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log('An error occured!')
  console.log(`PATH: "${req.path}"`)
  console.log(err)

  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res)
  }

  if (err instanceof z.ZodError) {
    handleZodError(res, err)
  }
  else if (err instanceof AppError) {
    handleAppError(res, err)
  }
  else {
    res.status(500).send("Internal Server Error")
  }
}

export default genericErrorHandler