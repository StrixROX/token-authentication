import { Box, Button, Link, Stack } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { logout } from "../lib/api"
import queryClient from '../config/queryClient'

function UserMenu() {
  const navigate = useNavigate()

  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear()
      navigate("/login", { replace: true })
    }
  })

  return (
    <Box>
      <Stack direction="row">
        <Button onClick={() => navigate("/")}>Profile</Button>
        <Button onClick={() => navigate("/settings")}>Settings</Button>
        <Button onClick={signOut}>Logout</Button>
      </Stack>
    </Box>
  )
}

export default UserMenu