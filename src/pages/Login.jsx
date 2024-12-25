import { Box, Button, Container, Grid2 as Grid, Input, InputLabel, TextField, Typography } from "@mui/material"

function Login() {
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
        maxWidth="sm"
        sx={{
          margin: "auto",
          backgroundColor: (theme) => theme.palette.grey[900],
          borderRadius: 2,
          p: 4
        }}
      >
        <Grid container spacing={2} align={"right"}>
          <Grid size={12}>
            <Typography variant="h5" align="center" sx={{mb: 1.5}}>Login</Typography>
          </Grid>

          <Grid size={12}>
            <TextField
              label="Username"
              size="small"
              fullWidth={true}
              required={true}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Password"
              type="password"
              size="small"
              fullWidth={true}
              required={true}
            />
          </Grid>

          <Grid size={12}>
            <Button variant="contained">Login</Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Login