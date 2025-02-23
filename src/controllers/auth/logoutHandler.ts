import errorBoundary from "../../utils/errorBoundary"
import { OK } from "../../constants/http"
import { clearAuthCookies } from "../../utils/cookies"
import { verifyToken } from "../../utils/jwt"
import SessionModel from "../../models/session"

const logoutHandler = errorBoundary(async (req, res) => {
  const accessToken = req.cookies["accessToken"]
  const { payload } = verifyToken(accessToken)

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId)
  }

  return clearAuthCookies(res).status(OK).json({
    message: "Logout successful"
  })
})

export default logoutHandler