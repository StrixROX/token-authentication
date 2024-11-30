import errorBoundary from "../utils/errorBoundary"
import { createAccount } from "../services/auth.service"
import { CREATED } from "../constants/http"
import { setAuthCookies } from "../utils/cookies"
import { loginSchema, registerSchema } from "./auth.schemas"

export const registerHandler = errorBoundary(async (req, res) => {
  // validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"]
  })

  // call service
  const { user, accessToken, refreshToken } = await createAccount(request)

  // return response
  return setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json(user)
})

export const loginHandler = errorBoundary(async (req, res) => {
  // validate request
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"]
  })

  // call service

  // return response
})