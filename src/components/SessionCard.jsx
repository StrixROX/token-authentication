import { Delete } from "@mui/icons-material"
import { Box, CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import useDeleteSession from "../hooks/useDeleteSession"

function SessionCard({ session }) {
  const { _id, createdAt, userAgent, isCurrent } = session

  const { deleteSession, isPending } = useDeleteSession(_id)

  return (
    <Stack
      spacing={1}
      sx={{
        border: "1px solid transparent",
        borderColor: "grey.700",
        borderRadius: "5px",
        p: 2
      }}
      textAlign="left"
    >
      <Typography variant="body1">
        Created at: <Typography sx={{ color: "grey.500" }}>{new Date(createdAt).toLocaleDateString("en-IN")} {new Date(createdAt).toLocaleTimeString("en-IN")}</Typography>
      </Typography>

      <Typography variant="body1">
        User agent: <Typography sx={{ color: "grey.500" }}>{userAgent}</Typography>
      </Typography>

      {isCurrent && (
        <Typography variant="body1" sx={{ fontStyle: "italic" }}>
          Current session
        </Typography>
      )}

      {!isCurrent && (
        <Box>
          <IconButton onClick={!isPending ? deleteSession : null} sx={{ color: "error.main", float: "right" }}>
            {isPending ? <CircularProgress /> : <Delete />}
          </IconButton>
        </Box>
      )}
    </Stack>
  )
}

export default SessionCard