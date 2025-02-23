import errorBoundary from "../../utils/errorBoundary"
import { resetPassword } from "../../services/auth.service"
import { OK } from "../../constants/http"
import { clearAuthCookies } from "../../utils/cookies"
import { resetPasswordSchema } from "./schemas"

const resetPasswordHandler = errorBoundary(async (req, res) => {
  const request = resetPasswordSchema.parse(req.body)

  await resetPassword(request)

  return clearAuthCookies(res).status(OK).json({
    message: "Password reset successful"
  })
})

export default resetPasswordHandler