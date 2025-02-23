import { NOT_FOUND, OK, UNAUTHORIZED } from "../../constants/http";
import UserModel from "../../models/user";
import appAssert from "../../utils/appAssert";
import AuthenticatedRequest from "../../utils/AuthenticatedRequest";
import errorBoundary from "../../utils/errorBoundary";

const getUserHandler = errorBoundary(async (req: AuthenticatedRequest, res) => {
  const userId = req.userId
  appAssert(userId, UNAUTHORIZED, "Invalid user")

  const user = await UserModel.findById(userId)
  appAssert(user, NOT_FOUND, "User not found")

  return res.status(OK).json(user.omitPassword())
})

export default getUserHandler