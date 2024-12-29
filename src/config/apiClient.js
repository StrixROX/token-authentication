import axios from "axios"
import queryClient from "./queryClient"
import { navigate } from "../lib/navigation"

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
}

const API = axios.create(options)
const TokenRefreshClient = axios.create(options)
TokenRefreshClient.interceptors.response.use(res => res.data)

API.interceptors.response.use(
  res => res.data,
  async err => {
    const { config, response } = err
    const { status, data } = response || {}

    // try to refresh access token behind the scene
    if (status === 401 && data?.errorCode === "InvalidAccessToken") {
      try {
        await TokenRefreshClient.get("/auth/refresh")
        return TokenRefreshClient(config)
      }
      catch (error) {
        queryClient.clear()
        navigate("/login", {
          state: {
            redirectUrl: window.location.pathname
          }
        })
      }
    }

    return Promise.reject({ status, ...data })
  }
)

export default API