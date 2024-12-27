import { Alert, Box, Container, Link } from "@mui/material"
import PasswordResetForm from "../components/PasswordResetForm"
import { useSearchParams } from "react-router-dom"

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get("code")
  const exp = Number(searchParams.get("exp"))
  const now = Date.now()
  
  const isLinkValid = code && exp && now < exp
  
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
          {
            isLinkValid
            ? <PasswordResetForm code={code} />
            : (
              <Alert severity="error">
                The link is either invalid or expired. <Link href="/password/forgot">Request a new link</Link>
              </Alert>
            )
          }
      </Container>
    </Box>
  )
}

export default ResetPassword