import { OK, UNAUTHORIZED } from "../../constants/http";
import SessionModel from "../../models/session";
import appAssert from "../../utils/appAssert";
import AuthenticatedRequest from "../../utils/AuthenticatedRequest";
import errorBoundary from "../../utils/errorBoundary";

const getSessionHandler = errorBoundary(async (req: AuthenticatedRequest, res) => {
  const userId = req.userId
  appAssert(userId, UNAUTHORIZED, "Invalid user")

  const sessionId = req.sessionId
  appAssert(sessionId, UNAUTHORIZED, "Invalid session")

  const sessions = await SessionModel.find(
    {
      userId,
      expiresAt: { $gt: new Date() }
    },
    { _id: 1, userAgent: 1, createdAt: 1 },
    { sort: { createdAt: -1 } }
  )

  return res.status(OK).json(
    sessions.map(session => ({
      ...session.toObject(),
      ...(
        (session.id === sessionId) && {
          isCurrent: true
        }
      )
    }))
  )
})

export default getSessionHandler