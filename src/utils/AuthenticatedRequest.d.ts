import { Request } from "express"
import mongoose from "mongoose"

export default interface AuthenticatedRequest extends Request {
  userId?: mongoose.Types.ObjectId
  sessionId?: mongoose.Types.ObjectId
}