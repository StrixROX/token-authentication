import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { verifyEmail } from "../lib/api"
import { Alert, Box, CircularProgress, Link } from "@mui/material"

function VerifyEmail() {
  const { code } = useParams()

  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code)
  })

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: "1rem",
        my: "3rem"
      }}
    >
      {isPending && <CircularProgress />}
      {isSuccess && (
        <Alert severity="success">
          Email verified successfully!
        </Alert>
      )}
      {isError && (
        <Alert severity="error">
          The link is either invalid or expired. <Link href="/password/reset">Get a new link</Link>
        </Alert>
      )}
      {!isPending && <Link href="/">Back to home</Link>}
    </Box>
  )
}

export default VerifyEmail