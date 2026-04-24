import React from 'react'
import { Navigate } from 'react-router-dom'
import { FaWheatAwn } from 'react-icons/fa6'
import { LuArrowLeft, LuLeaf, LuSprout } from 'react-icons/lu'
import { LoginForm } from '../features/auth'
import { useAuthContext } from '../context/AuthContext'
import './LoginPage.css'

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuthContext()

  if (!loading && isAuthenticated) return <Navigate to="/admin/dashboard" replace />

  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden="true">
        <div className="login-page__bg-leaf login-page__bg-leaf--1"><LuLeaf /></div>
        <div className="login-page__bg-leaf login-page__bg-leaf--2"><FaWheatAwn /></div>
        <div className="login-page__bg-leaf login-page__bg-leaf--3"><LuSprout /></div>
      </div>

      <div className="login-page__card">
        <div className="login-page__header">
          <div className="login-page__logo"><LuLeaf /></div>
          <h1 className="login-page__title">Thuận Châu</h1>
          <p className="login-page__subtitle">Đăng nhập quản trị hệ thống</p>
        </div>

        <LoginForm />

        <p className="login-page__back">
          <a href="/">
            <LuArrowLeft aria-hidden="true" />
            Về trang tra cứu công khai
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
