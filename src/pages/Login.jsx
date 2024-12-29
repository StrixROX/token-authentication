import { Box, Button, Container, Link, Stack, TextField, Typography } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { login } from "../lib/api"
import { useLocation, useNavigate } from "react-router-dom"

function Login() {
  const location = useLocation()
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const redirectUrl = location.state?.redirectUrl || "/"

  const { mutate: signIn, isPending, isError } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(redirectUrl, { replace: true })
    }
  })

  return (
    <Box
      sx={{
        display: "grid",
        alignContent: "center",
        minHeight: "100vh",
        boxSizing: "border-box"
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          margin: "auto",
          backgroundColor: (theme) => theme.palette.grey[900],
          borderRadius: 2,
          py: 6
        }}
      >
        <Stack spacing={2} align={"right"}>
          <Typography variant="h5" align="center">Login</Typography>

          {
            isError && (
              <Box color={(theme) => theme.palette.error.main} textAlign="left">
                Invalid email or password.
              </Box>
            )
          }

          <TextField
            label="Email ID"
            type="email"
            size="small"
            fullWidth={true}
            required={true}
            autoFocus={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            size="small"
            fullWidth={true}
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && signIn({ email, password })}
          />

          <Link href="/password/forgot">Forgot password?</Link>
          <Button
            variant="contained"
            disabled={!email || password.length < 6 || isPending}
            onClick={() => signIn({ email, password })}
          >
            Login
          </Button>
          <Typography variant="body1" align="center">
            Don&apos;t have an account? <Link href="/register">Sign-up</Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default Login