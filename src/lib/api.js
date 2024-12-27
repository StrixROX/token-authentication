import API from "../config/apiClient";

export const login = async (data) => API.post("/auth/login", data)
export const register = async (data) => API.post("/auth/register", data)
export const verifyEmail = async (verificationCode) => API.get(`/auth/email/verify/${verificationCode}`)
export const sendPasswordResetEmail = async (email) => API.post("/auth/password/forgot", { email })
export const resetPassword = async ({ verificationCode, password }) => API.post("/auth/password/reset", { verificationCode, password })