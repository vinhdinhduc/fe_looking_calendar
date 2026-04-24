import { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'

const useAuth = () => {
  const { login, logout, user, isAuthenticated, isAdmin, loading } = useAuthContext()
  const toast = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError]   = useState(null)

  const handleLogin = async (username, password) => {
    setSubmitting(true)
    setFormError(null)
    try {
      await login(username, password)
      toast.success('Đăng nhập thành công!')
      return true
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Đăng nhập thất bại'
      setFormError(msg)
      toast.error(msg)
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.info('Đã đăng xuất')
  }

  return { user, isAuthenticated, isAdmin, loading, submitting, formError, handleLogin, handleLogout }
}

export default useAuth
