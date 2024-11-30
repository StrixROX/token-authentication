import { CookieOptions, Response } from "express"
import { NODE_ENV } from "../constants/env"
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date"

type Params = {
  res: Response,
  accessToken: string,
  refreshToken: string
}

const secure = NODE_ENV !== 'development'

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure
}

const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow()
})

const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: "/auth/refresh"
})

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
  res.cookie("accessToken", accessToken, getAccessTokenCookieOptions())
  res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions())

  return res
}