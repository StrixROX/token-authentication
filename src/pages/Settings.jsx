import { Alert, Box, CircularProgress, Container, Stack, Typography } from "@mui/material"
import useSessions from "../hooks/useSessions"
import SessionCard from "../components/SessionCard"

function Settings() {
  const { sessions, isPending, isSuccess, isError } = useSessions()

  return (
    <Box
      sx={{
        display: "grid",
        alignContent: "center",
        minHeight: "100vh",
        boxSizing: "border-box"
      }}
    >
      <Typography variant="h5" textAlign="center" my="1rem">My Sessions</Typography>

      {isPending && <CircularProgress />}

      {isError && (
        <Alert severity="error">
          Failed to get sessions.
        </Alert>
      )}

      {isSuccess && (
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
            {sessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))}
          </Stack>
        </Container>
      )}
    </Box>
  )
}

export default Settings