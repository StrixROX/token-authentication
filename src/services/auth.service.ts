import { CLIENT_ORIGIN } from "../constants/env"
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED } from "../constants/http"
import VerificationCodeType from "../constants/verificationCodeTypes"
import SessionModel from "../models/session.model"
import UserModel from "../models/user.model"
import VerificationCodeModel from "../models/verificationCode.model"
import appAssert from "../utils/appAssert"
import { hashValue } from "../utils/bcrypt"
import { fiveMinutesAgo, ONE_DAY_MS, oneHourFromNow, oneYearFromNow, thirtyDaysFromNow } from "../utils/date"
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplates"
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt"
import { sendMail } from "../utils/sendMail"

type CreateAccountParams = {
  email: string,
  password: string,
  userAgent?: string
}

export const createAccount = async (data: CreateAccountParams) => {
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

type LoginUserParams = {
  email: string,
  password: string,
  userAgent?: string
}

export const loginUser = async ({ email, password, userAgent }: LoginUserParams) => {
  // get the user by email
  const user = await UserModel.findOne({ email })

  appAssert(user, UNAUTHORIZED, "Invalid email or password")

  // validate the password from request
  const isPasswordValid = await user.comparePassword(password)
  appAssert(isPasswordValid, UNAUTHORIZED, "Invalid email or password")

  // create a session
  const userId = user._id

  const session = await SessionModel.create({
    userId,
    userAgent
  })

  const sessionInfo = {
    sessionId: session._id
  }

  // sign access & refresh tokens
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions)
  const accessToken = signToken({ ...sessionInfo, userId: user._id })

  // return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken
  }
}

export const refreshUserAccessToken = async (refreshToken: string) => {
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

export const verifyEmail = async (code: string) => {
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

export const sendPasswordResetEmail = async (email: string) => {
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

type ResetPasswordParams = {
  verificationCode: string,
  password: string
}

export const resetPassword = async ({
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