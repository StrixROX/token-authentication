import { Box, CircularProgress } from '@mui/material'
import useAuth from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'
import UserMenu from './UserMenu'

function AppContainer() {
  const { user, isLoading } = useAuth()

  return (
    <>
      {
        isLoading && (
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
            <CircularProgress />
          </Box>
        )
      }
      {
        !isLoading && user && (
          <>
            <UserMenu />
            <Outlet />
          </>
        )
      }
      {
        !isLoading && !user && (
          <Navigate
            to="/login"
            replace
            state={{
              redirectUrl: window.location.pathname
            }}
          />
        )
      }
    </>
  )
}

export default AppContainer