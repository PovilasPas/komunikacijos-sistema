import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [access, setAccessToken] = useState('')
    const [refresh, setRefreshToken] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token1 = localStorage.getItem('access')
        setAccessToken(token1)
        const token2 = localStorage.getItem('refresh')
        setRefreshToken(token2)
        if(token1)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token1}`
        setLoading(false)
    }, [])

    if(loading) return null;

    const setAccess = (token) => {
        localStorage.setItem('access', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setAccessToken(token)
    }

    const setRefresh = (token) => {
        localStorage.setItem('refresh', token)
        setRefreshToken(token)
    }

    const clearAccess = () => {
        localStorage.removeItem('access')
        delete axios.defaults.headers.common['Authorization']
        setAccessToken(undefined)
    }

    const clearRefresh = () => {
        localStorage.removeItem('refresh')
        setRefreshToken(undefined)
    }

    return (
        <AuthContext.Provider value={{access, setAccess, clearAccess, refresh, setRefresh, clearRefresh, loading}}>
            {children}
        </AuthContext.Provider>
    )
}
