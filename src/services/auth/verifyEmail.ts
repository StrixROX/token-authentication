import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../../constants/http"
import VerificationCodeType from "../../constants/verificationCodeTypes"
import UserModel from "../../models/user"
import VerificationCodeModel from "../../models/verificationCode"
import appAssert from "../../utils/appAssert"

const verifyEmail = async (code: string) => {
  // get verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() }
  })
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code")

  // get user by id and set verified = true
  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, { verified: true }, { new: true })
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email")

  // delete verification code
  await validCode.deleteOne();

  // return user
  return {
    user: updatedUser.omitPassword()
  }
}

export default verifyEmail