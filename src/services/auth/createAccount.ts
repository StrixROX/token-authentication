import { CLIENT_ORIGIN } from "../../constants/env"
import { CONFLICT } from "../../constants/http"
import VerificationCodeType from "../../constants/verificationCodeTypes"
import SessionModel from "../../models/session"
import UserModel from "../../models/user"
import VerificationCodeModel from "../../models/verificationCode"
import appAssert from "../../utils/appAssert"
import { oneYearFromNow } from "../../utils/date"
import { getVerifyEmailTemplate } from "../../utils/emailTemplates"
import { refreshTokenSignOptions, signToken } from "../../utils/jwt"
import { sendMail } from "../../utils/sendMail"

type CreateAccountParams = {
  email: string,
  password: string,
  userAgent?: string
}

const createAccount = async (data: CreateAccountParams) => {
  // verify existing user doesn't exist
  const existingUser = await UserModel.exists({ email: data.email })

  appAssert(!existingUser, CONFLICT, "Email already in use")

  // create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password
  })

  const userId = user._id

  // create verification code
  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow()
  })

  const url = `${CLIENT_ORIGIN}/email/verify/${verificationCode._id}`
  // send verification email
  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url)
  })

  if (error) {
    console.log(error)
  }

  // create session in system
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent
  })

  // sign access token & refresh token
  const refreshToken = signToken({ sessionId: session._id }, refreshTokenSignOptions)
  const accessToken = signToken({ userId, sessionId: session._id })

  // return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken
  }
}

export default createAccount