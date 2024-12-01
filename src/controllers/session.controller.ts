import { z } from "zod";
import { NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";
import errorBoundary from "../utils/errorBoundary";

export const getSessionHandler = errorBoundary(async (req, res) => {
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

export const deleteSessionHandler = errorBoundary(async (req, res) => {
  const userId = req.userId
  appAssert(userId, UNAUTHORIZED, "Invalid user")

  const sessionId = z.string().parse(req.params.id)

  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId
  })
  appAssert(deleted, NOT_FOUND, "Session not found")

  return res.status(OK).json({
    message: "Session removed"
  })
})