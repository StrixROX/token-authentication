import { Box } from "@mui/material"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"

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
    </Routes>
  )
}

export default App
