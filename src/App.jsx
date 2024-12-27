import { Box } from "@mui/material"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VerifyEmail from "./pages/VerifyEmail"

const Home = () => {
  return (
    <Box>Home</Box>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email/verify/:code" element={<VerifyEmail />} />
    </Routes>
  )
}

export default App
