import { Box, Button, Container, Link, Stack, TextField, Typography } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { register } from "../lib/api"
import { useNavigate } from "react-router-dom"

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { mutate: createAccount, isPending, isError, error } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/", { replace: true })
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
          <Typography variant="h5" align="center">Register</Typography>

          {
            isError && (
              <Box color={(theme) => theme.palette.error.main} textAlign="left">
                {error?.message ?? "An error occured."}
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
          />

          <TextField
            label="Confirm Password"
            type="password"
            size="small"
            fullWidth={true}
            required={true}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createAccount({ email, password, confirmPassword })}
          />

          <Button
            variant="contained"
            disabled={!email || password.length < 6 || confirmPassword.length < 6 || isPending}
            onClick={() => createAccount({ email, password, confirmPassword })}
          >
            Create Account
          </Button>
          <Typography variant="body1" align="center">
            Already have an account? <Link href="/login">Sign in</Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default Register