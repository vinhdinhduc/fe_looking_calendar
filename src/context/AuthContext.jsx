import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { setTokens, clearTokens, saveUser, getSavedUser, isTokenPresent } from '../utils/tokenHelper'
import { authService } from '../features/auth/services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(getSavedUser)
  const [loading, setLoading] = useState(true)

  // Verify token on mount by fetching /me
  useEffect(() => {
    const verify = async () => {
      if (!isTokenPresent()) { setLoading(false); return }
      try {
        const data = await authService.getMe()
        setUser(data)
        saveUser(data)
      } catch {
        clearTokens()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = useCallback(async (username, password) => {
    const result = await authService.login(username, password)
    setTokens(result.accessToken, result.refreshToken)
    saveUser(result.user)
    setUser(result.user)
    return result
  }, [])

  const logout = useCallback(async () => {
    try { await authService.logout() } catch { /* ignore */ }
    clearTokens()
    setUser(null)
  }, [])

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'
  const isStaff = user?.role === 'staff' || isAdmin

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, isAdmin, isStaff, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
