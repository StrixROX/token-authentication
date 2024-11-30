import UserModel from "../models/user.model"

type CreateAccountParams = {
  email: string,
  password: string,
  userAgent?: string
}

export const createAccount = async (data: CreateAccountParams) => {
  // verify existing user doesn't exist
  const existingUser = await UserModel.exists({ email: data.email })
  
  if (existingUser) {
    throw Error("User already exists")
  }
  
  // create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password
  })

  // create verification code

  // send email

  // create session in system

  // sign access token & refresh token

  // return user & tokens
}