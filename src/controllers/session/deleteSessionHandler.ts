import { z } from "zod";
import { NOT_FOUND, OK, UNAUTHORIZED } from "../../constants/http";
import SessionModel from "../../models/session.model";
import appAssert from "../../utils/appAssert";
import errorBoundary from "../../utils/errorBoundary";
import AuthenticatedRequest from "../../utils/AuthenticatedRequest";

const deleteSessionHandler = errorBoundary(async (req: AuthenticatedRequest, res) => {
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

export default deleteSessionHandler