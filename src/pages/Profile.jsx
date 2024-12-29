import { Alert, Box, Container, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth"

function Profile() {
  const { user } = useAuth()
  const { email, verified, createdAt } = user;

  return (
    <Box
      sx={{
        display: "grid",
        alignContent: "center",
        minHeight: "100vh",
        boxSizing: "border-box"
      }}
    >
      <Typography variant="h5" textAlign="center" my="1rem">My Account</Typography>

      <Container
        maxWidth="xs"
        sx={{
          margin: "auto",
          backgroundColor: (theme) => theme.palette.grey[900],
          borderRadius: 2,
          py: 6
        }}
      >
        {!verified && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please verify your email
          </Alert>
        )}

        <Typography>
          Email: <Typography component="span" sx={{ color: "grey.500" }}>{email}</Typography>
        </Typography>
        <Typography>
          Created on: <Typography component="span" sx={{ color: "grey.500" }}>{new Date(createdAt).toLocaleDateString("en-IN")} {new Date(createdAt).toLocaleTimeString("en-IN")}</Typography>
        </Typography>
      </Container>
    </Box>
  )
}

export default Profile