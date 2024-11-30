import { CookieOptions, Response } from "express"
import { NODE_ENV } from "../constants/env"
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date"

type Params = {
  res: Response,
  accessToken: string,
  refreshToken: string
}

export const REFRESH_PATH = "/auth/refresh"
const secure = NODE_ENV !== 'development'

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure
}

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow()
})

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH
})

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
  res.cookie("accessToken", accessToken, getAccessTokenCookieOptions())
  res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions())

  return res
}

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken")
  res.clearCookie("refreshToken", { path: REFRESH_PATH })
  
  return res
}