import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../../constants/http"
import VerificationCodeType from "../../constants/verificationCodeTypes"
import SessionModel from "../../models/session"
import UserModel from "../../models/user"
import VerificationCodeModel from "../../models/verificationCode"
import appAssert from "../../utils/appAssert"
import { hashValue } from "../../utils/bcrypt"

type ResetPasswordParams = {
  verificationCode: string,
  password: string
}

const resetPassword = async ({
  verificationCode,
  password
}: ResetPasswordParams) => {
  // get verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: Date.now() }
  })
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code")

  // update the user's password
  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId,
    { password: await hashValue(password) }
  )

  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password")

  // delete the verification code
  await validCode.deleteOne()

  // delete all sessions
  await SessionModel.deleteMany({ userId: updatedUser._id })

  return {
    user: updatedUser.omitPassword()
  }
}

export default resetPassword