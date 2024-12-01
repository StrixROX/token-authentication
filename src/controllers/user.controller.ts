import { NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import errorBoundary from "../utils/errorBoundary";

export const getUserHandler = errorBoundary(async (req, res) => {
  const userId = req.userId
  appAssert(userId, UNAUTHORIZED, "Invalid user")

  const user = await UserModel.findById(userId)
  appAssert(user, NOT_FOUND, "User not found")

  return res.status(OK).json(user.omitPassword())
})