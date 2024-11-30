import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { compareValue } from "../utils/bcrypt"

export interface UserDocument extends mongoose.Document {
  email: string,
  password: string,
  verified: boolean,
  createdAt: Date,
  updatedAt: Date,
  comparePassword: (val: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<UserDocument>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, required: true, default: false }
}, {
  timestamps: true
})

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next()
    return null
  }

  this.password = await bcrypt.hash(this.password, 8)
  next()
})

userSchema.methods.comparePassword = async function (val: string) {
  return await compareValue(val, this.password)
}

const UserModel = mongoose.model<UserDocument>("User", userSchema)

export default UserModel