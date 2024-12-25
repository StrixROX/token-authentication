import { createTheme, CssBaseline, ThemeProvider as ThemeProvider_mui } from "@mui/material"

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
})

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeProvider_mui theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider_mui>
  )
}