import React, { useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import useAuth from '../hooks/useAuth'
import Button from '../../../components/Button/Button'
import './LoginForm.css'

const LoginForm = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { handleLogin, handleForgotPassword, handleResetPassword, submitting, formError } = useAuth()

  const urlToken = searchParams.get('token') || ''
  const isResetFromUrl = searchParams.get('mode') === 'reset' && !!urlToken

  const [mode, setMode] = useState(isResetFromUrl ? 'reset' : 'login')
  const [fields, setFields]   = useState({ username: '', password: '', rememberMe: true })
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetFields, setResetFields] = useState({ token: urlToken, newPassword: '', confirmPassword: '' })
  const [errors, setErrors]   = useState({})
  const [showPass, setShowPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const validateLogin = () => {
    const e = {}
    if (!fields.username.trim()) e.username = 'Vui lòng nhập tên đăng nhập'
    if (!fields.password)        e.password = 'Vui lòng nhập mật khẩu'
    else if (fields.password.length < 6) e.password = 'Mật khẩu ít nhất 6 ký tự'
    return e
  }

  const validateForgot = () => {
    const e = {}
    const email = forgotEmail.trim()
    if (!email) e.email = 'Vui lòng nhập email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email không hợp lệ'
    return e
  }

  const validateReset = () => {
    const e = {}
    if (!resetFields.token.trim()) e.token = 'Thiếu token đặt lại mật khẩu'
    if (!resetFields.newPassword) e.newPassword = 'Vui lòng nhập mật khẩu mới'
    else if (resetFields.newPassword.length < 6) e.newPassword = 'Mật khẩu ít nhất 6 ký tự'
    if (!resetFields.confirmPassword) e.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    else if (resetFields.newPassword !== resetFields.confirmPassword) e.confirmPassword = 'Xác nhận mật khẩu không khớp'
    return e
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleResetChange = (e) => {
    const { name, value } = e.target
    setResetFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const goLoginMode = () => {
    setMode('login')
    setErrors({})
    if (searchParams.get('mode') || searchParams.get('token')) setSearchParams({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (mode === 'forgot') {
      const errs = validateForgot()
      if (Object.keys(errs).length) { setErrors(errs); return }
      const result = await handleForgotPassword(forgotEmail.trim())
      if (result.ok) goLoginMode()
      return
    }

    if (mode === 'reset') {
      const errs = validateReset()
      if (Object.keys(errs).length) { setErrors(errs); return }
      const result = await handleResetPassword(
        resetFields.token.trim(),
        resetFields.newPassword,
        resetFields.confirmPassword
      )
      if (result.ok) {
        setResetFields({ token: '', newPassword: '', confirmPassword: '' })
        goLoginMode()
      }
      return
    }

    const errs = validateLogin()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const ok = await handleLogin(fields.username, fields.password, fields.rememberMe)
    if (ok) navigate(from, { replace: true })
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      {mode === 'forgot' && (
        <div className="login-form__hint">Nhập email của tài khoản để nhận liên kết đặt lại mật khẩu.</div>
      )}

      {mode === 'reset' && (
        <div className="login-form__hint">Nhập mật khẩu mới cho tài khoản của bạn.</div>
      )}

      {mode === 'forgot' && (
        <div className="login-form__field">
          <label className="login-form__label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`login-form__input ${errors.email ? 'login-form__input--error' : ''}`}
            placeholder="Nhập email"
            value={forgotEmail}
            onChange={(e) => {
              setForgotEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            autoComplete="email"
            autoFocus
          />
          {errors.email && <span className="login-form__error">{errors.email}</span>}
        </div>
      )}

      {mode === 'reset' && (
        <>
          <div className="login-form__field">
            <label className="login-form__label" htmlFor="token">Token đặt lại mật khẩu</label>
            <input
              id="token"
              name="token"
              type="text"
              className={`login-form__input ${errors.token ? 'login-form__input--error' : ''}`}
              placeholder="Nhập token"
              value={resetFields.token}
              onChange={handleResetChange}
              autoComplete="off"
            />
            {errors.token && <span className="login-form__error">{errors.token}</span>}
          </div>

          <div className="login-form__field">
            <label className="login-form__label" htmlFor="newPassword">Mật khẩu mới</label>
            <div className="login-form__input-wrapper">
              <input
                id="newPassword"
                name="newPassword"
                type={showNewPass ? 'text' : 'password'}
                className={`login-form__input ${errors.newPassword ? 'login-form__input--error' : ''}`}
                placeholder="Nhập mật khẩu mới"
                value={resetFields.newPassword}
                onChange={handleResetChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="login-form__toggle-pass"
                onClick={() => setShowNewPass(!showNewPass)}
                aria-label={showNewPass ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
              >
                {showNewPass ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}
              </button>
            </div>
            {errors.newPassword && <span className="login-form__error">{errors.newPassword}</span>}
          </div>

          <div className="login-form__field">
            <label className="login-form__label" htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
            <div className="login-form__input-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPass ? 'text' : 'password'}
                className={`login-form__input ${errors.confirmPassword ? 'login-form__input--error' : ''}`}
                placeholder="Nhập lại mật khẩu mới"
                value={resetFields.confirmPassword}
                onChange={handleResetChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="login-form__toggle-pass"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                aria-label={showConfirmPass ? 'Ẩn xác nhận mật khẩu' : 'Hiện xác nhận mật khẩu'}
              >
                {showConfirmPass ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}
              </button>
            </div>
            {errors.confirmPassword && <span className="login-form__error">{errors.confirmPassword}</span>}
          </div>
        </>
      )}

      {mode === 'login' && (
        <>
      <div className="login-form__field">
        <label className="login-form__label" htmlFor="username">Tên đăng nhập</label>
        <input
          id="username"
          name="username"
          type="text"
          className={`login-form__input ${errors.username ? 'login-form__input--error' : ''}`}
          placeholder="Nhập tên đăng nhập"
          value={fields.username}
          onChange={handleChange}
          autoComplete="username"
          autoFocus
        />
        {errors.username && <span className="login-form__error">{errors.username}</span>}
      </div>

      <div className="login-form__field">
        <label className="login-form__label" htmlFor="password">Mật khẩu</label>
        <div className="login-form__input-wrapper">
          <input
            id="password"
            name="password"
            type={showPass ? 'text' : 'password'}
            className={`login-form__input ${errors.password ? 'login-form__input--error' : ''}`}
            placeholder="Nhập mật khẩu"
            value={fields.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="login-form__toggle-pass"
            onClick={() => setShowPass(!showPass)}
            aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPass ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}
          </button>
        </div>
        {errors.password && <span className="login-form__error">{errors.password}</span>}
      </div>

      <label className="login-form__remember">
        <input
          type="checkbox"
          name="rememberMe"
          checked={fields.rememberMe}
          onChange={handleChange}
        />
        Ghi nhớ đăng nhập
      </label>
        </>
      )}

      {formError && (
        <div className="login-form__api-error" role="alert">{formError}</div>
      )}

      <div className="login-form__switches">
        {mode !== 'login' && (
          <button type="button" className="login-form__link-btn" onClick={goLoginMode}>
            Quay lại đăng nhập
          </button>
        )}
        {mode === 'login' && (
          <button type="button" className="login-form__link-btn" onClick={() => { setMode('forgot'); setErrors({}) }}>
            Quên mật khẩu?
          </button>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" loading={submitting} className="login-form__submit">
        {mode === 'forgot' ? 'Gửi yêu cầu' : mode === 'reset' ? 'Đặt lại mật khẩu' : 'Đăng nhập'}
      </Button>
    </form>
  )
}

export default LoginForm
