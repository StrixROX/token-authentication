import errorBoundary from "../../utils/errorBoundary"
import { refreshUserAccessToken } from "../../services/auth.service"
import { OK, UNAUTHORIZED } from "../../constants/http"
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from "../../utils/cookies"
import appAssert from "../../utils/appAssert"

const refreshHandler = errorBoundary(async (req, res) => {
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

export default refreshHandler