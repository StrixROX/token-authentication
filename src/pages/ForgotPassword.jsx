import { Alert, Box, Button, Container, Link, Stack, TextField, Typography } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { sendPasswordResetEmail } from "../lib/api"

function ForgotPassword() {
  const [email, setEmail] = useState("")

  const { mutate: sendPasswordReset, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: sendPasswordResetEmail
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

          {!isSuccess && (
            <>
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

              <Button
                variant="contained"
                disabled={!email || isPending}
                onClick={() => sendPasswordReset(email)}
              >
                Reset Password
              </Button>
            </>
          )}

          {isSuccess && (
            <Alert severity="success" sx={{ textAlign: "center" }}>
              Email sent! Check your inbox for further instructions.
            </Alert>
          )}

          <Typography variant="body1" align="center">
            Go back to&nbsp;
            <Link href="/">Home</Link>&nbsp;|&nbsp;
            <Link href="/login">Sign in</Link>&nbsp;|&nbsp;
            <Link href="/register">Create Account</Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default ForgotPassword