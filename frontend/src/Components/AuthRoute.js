import React, { useContext } from 'react'
import { AuthContext } from './AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute({redirect}) {
  const {access, refresh} = useContext(AuthContext)
  return access && refresh ? <Outlet /> : <Navigate to={redirect} />
}

export default ProtectedRoute
