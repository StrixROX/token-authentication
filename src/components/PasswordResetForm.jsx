import { Alert, Box, Button, Link, Stack, TextField, Typography } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { resetPassword } from "../lib/api"

function PasswordResetForm({ code }) {
  const [password, setPassword] = useState("")

  const { mutate: resetUserPassword, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: resetPassword
  })

  return (
    <Stack spacing={2} align={"right"}>
      <Typography variant="h5" align="center">Change Your Password</Typography>

      {
        isError && (
          <Box color={(theme) => theme.palette.error.main} textAlign="left">
            {error?.message ?? "An error occured."}
          </Box>
        )
      }

      {
        isSuccess && (
          <>
            <Alert severity="success">
              Password updated succesfully!
            </Alert>

            <Link href="/login" sx={{ textAlign: "center" }}>Sign in</Link>
          </>
        )
      }

      {
        !isSuccess && (
          <>
            <TextField
              label="New Password"
              type="password"
              size="small"
              fullWidth={true}
              required={true}
              value={password}
              autoFocus={true}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && resetUserPassword({ password, verificationCode: code })}
            />

            <Button
              variant="contained"
              disabled={password.length < 6 || isPending}
              onClick={() => resetUserPassword({ password, verificationCode: code })}
            >
              Reset Password
            </Button>
          </>
        )
      }

    </Stack>
  )
}

export default PasswordResetForm