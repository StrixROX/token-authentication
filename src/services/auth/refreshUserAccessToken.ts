import { UNAUTHORIZED } from "../../constants/http"
import SessionModel from "../../models/session"
import appAssert from "../../utils/appAssert"
import { ONE_DAY_MS, thirtyDaysFromNow } from "../../utils/date"
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../../utils/jwt"

const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload, error } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret
  })
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token")

  const now = Date.now()
  const session = await SessionModel.findById(payload.sessionId)
  appAssert(session && session.expiresAt.getTime() > now, UNAUTHORIZED, "Session expired")

  // refresh session if it is expiring in the next 24 hours for better user experience
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow()
    await session.save()
  }

  const newRefreshToken = sessionNeedsRefresh ? signToken({ sessionId: session._id }, refreshTokenSignOptions) : undefined

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id
  })

  return {
    accessToken,
    newRefreshToken
  }
}

export default refreshUserAccessToken