import errorBoundary from "../../utils/errorBoundary"
import { verifyEmail } from "../../services/auth"
import { OK } from "../../constants/http"
import { verificationCodeSchema } from "./schemas"

const verifyEmailHandler = errorBoundary(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code)

  await verifyEmail(verificationCode)

  return res.status(OK).json({
    message: "Email was verified successfully"
  })
})

export default verifyEmailHandler