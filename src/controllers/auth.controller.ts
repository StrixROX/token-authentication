import errorBoundary from "../utils/errorBoundary"
import { createAccount, loginUser, refreshUserAccessToken, verifyEmail } from "../services/auth.service"
import { CREATED, OK, UNAUTHORIZED } from "../constants/http"
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookies } from "../utils/cookies"
import { loginSchema, registerSchema, verificationCodeSchema } from "./auth.schemas"
import { verifyToken } from "../utils/jwt"
import SessionModel from "../models/session.model"
import appAssert from "../utils/appAssert"

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
  const { accessToken, refreshToken } = await loginUser(request)

  // return response
  return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    message: "Login successful"
  })
})

export const logoutHandler = errorBoundary(async (req, res) => {
  const accessToken = req.cookies["accessToken"]
  const { payload } = verifyToken(accessToken)

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId)
  }

  return clearAuthCookies(res).status(OK).json({
    message: "Logout successful"
  })
})

export const refreshHandler = errorBoundary(async (req, res) => {
  const refreshToken = req.cookies["refreshToken"]
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token")

  const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken)

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions())
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access token refreshed"
    })
})

export const verifyEmailHandler = errorBoundary(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code)  

  await verifyEmail(verificationCode)

  return res.status(OK).json({
    message: "Email was verified successfully"
  })
})