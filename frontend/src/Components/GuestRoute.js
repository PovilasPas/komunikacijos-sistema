import React, { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

function GuestRoute({redirect}) {
  const {access, refresh} = useContext(AuthContext)
  return access && refresh ? <Navigate to={redirect} /> : <Outlet />
}

export default GuestRoute
