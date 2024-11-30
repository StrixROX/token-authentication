import { CONFLICT, UNAUTHORIZED } from "../constants/http"
import VerificationCodeType from "../constants/verificationCodeTypes"
import SessionModel from "../models/session.model"
import UserModel from "../models/user.model"
import VerificationCodeModel from "../models/verificationCode.model"
import appAssert from "../utils/appAssert"
import { oneYearFromNow } from "../utils/date"
import { refreshTokenSignOptions, signToken } from "../utils/jwt"

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

  // send verification email

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
  const isPasswordValid = user.comparePassword(password)
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