import { UNAUTHORIZED } from "../../constants/http"
import SessionModel from "../../models/session"
import UserModel from "../../models/user"
import appAssert from "../../utils/appAssert"
import { refreshTokenSignOptions, signToken } from "../../utils/jwt"

type LoginUserParams = {
  email: string,
  password: string,
  userAgent?: string
}

const loginUser = async ({ email, password, userAgent }: LoginUserParams) => {
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

export default loginUser