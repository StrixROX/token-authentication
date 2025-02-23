import { CLIENT_ORIGIN } from "../../constants/env"
import { INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS } from "../../constants/http"
import VerificationCodeType from "../../constants/verificationCodeTypes"
import UserModel from "../../models/user"
import VerificationCodeModel from "../../models/verificationCode"
import appAssert from "../../utils/appAssert"
import { fiveMinutesAgo, oneHourFromNow } from "../../utils/date"
import { getPasswordResetTemplate } from "../../utils/emailTemplates"
import { sendMail } from "../../utils/sendMail"

const sendPasswordResetEmail = async (email: string) => {
  // get the user by email
  const user = await UserModel.findOne({ email })
  appAssert(user, NOT_FOUND, "User not found")

  // check email rate limit
  const fiveMinAgo = fiveMinutesAgo()
  const count = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    createdAt: { $gt: fiveMinAgo }
  })
  appAssert(count < 2, TOO_MANY_REQUESTS, "Too many requests, please try again later")

  // create verification code
  const expiresAt = oneHourFromNow()
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    expiresAt,
  })

  // send verification email
  const url = `${CLIENT_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`
  const { data, error } = await sendMail({
    to: user.email,
    ...getPasswordResetTemplate(url)
  })
  appAssert(data?.id, INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`)

  // return success
  return {
    url,
    emailId: data.id
  }
}

export default sendPasswordResetEmail