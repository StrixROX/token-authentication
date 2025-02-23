import errorBoundary from "../../utils/errorBoundary"
import { loginUser } from "../../services/auth"
import { OK } from "../../constants/http"
import { setAuthCookies } from "../../utils/cookies"
import { loginSchema } from "./schemas"

const loginHandler = errorBoundary(async (req, res) => {
  // validate request
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"]
  })

  // call service
  const { accessToken, refreshToken } = await loginUser(request)

  // return response
  return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    message: "Login successful"
  })
})

export default loginHandler