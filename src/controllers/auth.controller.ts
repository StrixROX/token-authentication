import { z } from "zod"
import errorBoundary from "../utils/errorBoundary"
import { createAccount } from "../services/auth.service"
import { CREATED } from "../constants/http"
import { setAuthCookies } from "../utils/cookies"

const registerSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
  confirmPassword: z.string().min(6).max(255),
  userAgent: z.string().optional()
})
.refine(
  data => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  }
)

const registerHandler = errorBoundary(
  async (req, res) => {
    // validate request
    const request = registerSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"]
    })

    // call service
    const { user, accessToken, refreshToken } = await createAccount(request)

    // return response
    return setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).json(user)
  }
)

export default registerHandler