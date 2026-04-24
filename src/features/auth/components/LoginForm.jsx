import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import useAuth from '../hooks/useAuth'
import Button from '../../../components/Button/Button'
import './LoginForm.css'

const LoginForm = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { handleLogin, submitting, formError } = useAuth()

  const [fields, setFields]   = useState({ username: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [showPass, setShowPass] = useState(false)

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const validate = () => {
    const e = {}
    if (!fields.username.trim()) e.username = 'Vui lòng nhập tên đăng nhập'
    if (!fields.password)        e.password = 'Vui lòng nhập mật khẩu'
    else if (fields.password.length < 6) e.password = 'Mật khẩu ít nhất 6 ký tự'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const ok = await handleLogin(fields.username, fields.password)
    if (ok) navigate(from, { replace: true })
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
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

      {formError && (
        <div className="login-form__api-error" role="alert">{formError}</div>
      )}

      <Button type="submit" variant="primary" size="lg" loading={submitting} className="login-form__submit">
        Đăng nhập
      </Button>
    </form>
  )
}

export default LoginForm
