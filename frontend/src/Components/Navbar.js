import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import React, { useContext } from 'react'
import { AuthContext } from './AuthContext';
import { Link , useMatch, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack'

function Navbar({handleSidebarToggle}) {
  const { access, clearAccess, clearRefresh } = useContext(AuthContext)
  const isInChannel = useMatch('/channels/:id')
  const navigate = useNavigate()
  const handleLogout = () => {
    clearAccess()
    clearRefresh()
    enqueueSnackbar('Logout successful.', {
      variant: 'success'
    })
    navigate('/Login')
  }
  return (
    <AppBar position="fixed">
      <Toolbar>
        <ChatIcon sx={{mr: 1}}/>
        <Typography variant="h5" noWrap>
          Communication system
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {access ? (
          <>
            <Box sx={{display: {xs: 'flex', sm: 'none'}}}>
              <IconButton color="inherit" size="large" onClick={() => handleLogout()}>
                <LogoutIcon />
              </IconButton>
              {isInChannel && (
                <IconButton color="inherit" size="large" onClick={() => handleSidebarToggle()}>
                  <PeopleAltIcon />
                </IconButton>)}
            </Box>
            <Box sx={{display: {xs: 'none', sm: 'flex'}}}>
              <Button startIcon={<LogoutIcon />} color="inherit" onClick={() => handleLogout()}>
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{display: {xs: 'flex', sm: 'none'}}}>
              <IconButton color="inherit" size="large" LinkComponent={Link} to="/Login">
                <LoginIcon/>
              </IconButton>
              <IconButton color="inherit" size="large" LinkComponent={Link} to="/Register">
                <PersonAddIcon/>
              </IconButton>
            </Box>
            <Box sx={{display: {xs: 'none', sm: 'flex'}}}>
              <Button startIcon={<LoginIcon/>} color="inherit" LinkComponent={Link} to="/Login">
                Login
              </Button>
              <Button startIcon={<PersonAddIcon/>} color="inherit" LinkComponent={Link} to="/Register">
                Register
              </Button>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
