import errorBoundary from "../../utils/errorBoundary"
import { sendPasswordResetEmail } from "../../services/auth"
import { OK } from "../../constants/http"
import { emailSchema } from "./schemas"

const sendPasswordResetHandler = errorBoundary(async (req, res) => {
  const email = emailSchema.parse(req.body.email)

  await sendPasswordResetEmail(email)

  return res.status(OK).json({
    message: "Password reset email sent"
  })
})

export default sendPasswordResetHandler