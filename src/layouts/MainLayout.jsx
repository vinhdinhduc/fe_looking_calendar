import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LuChevronDown, LuLeaf, LuLogOut, LuMapPin, LuPhone, LuShield } from 'react-icons/lu'
import { useAuthContext } from '../context/AuthContext'
import './MainLayout.css'

const NAV_LINKS = [
  { to: '/',         label: 'Trang chủ' },
  { to: '/plants',   label: 'Cây trồng' },
  { to: '/calendar', label: 'Lịch thời vụ' },
  { to: '/faqs',     label: 'Hỏi & Đáp' },
  { to: '/contact',  label: 'Liên hệ' },
]

const MainLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const { pathname } = useLocation()
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuthContext()

  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!userMenuRef.current?.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    const onEscape = (event) => {
      if (event.key === 'Escape') setUserMenuOpen(false)
    }

    document.addEventListener('mousedown', onDocumentClick)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onDocumentClick)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  return (
    <div className="main-layout">
      <header className={`main-layout__header ${scrolled ? 'main-layout__header--scrolled' : ''}`}>
        <div className="container main-layout__header-inner">
          <Link to="/" className="main-layout__logo" aria-label="Trang chủ Thuận Châu">
            <LuLeaf className="main-layout__logo-icon" aria-hidden="true" />
            <div className="main-layout__logo-text">
              <span className="main-layout__logo-title">Thuận Châu</span>
              <span className="main-layout__logo-sub">Tra cứu Nông nghiệp</span>
            </div>
          </Link>

          <nav className={`main-layout__nav ${menuOpen ? 'main-layout__nav--open' : ''}`} aria-label="Điều hướng chính">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `main-layout__nav-link ${isActive ? 'main-layout__nav-link--active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="main-layout__header-actions">
            {loading ? (
              <span className="main-layout__auth-skeleton" aria-hidden="true" />
            ) : isAuthenticated ? (
              <div className="main-layout__user-menu" ref={userMenuRef}>
                <button
                  className="main-layout__user-chip"
                  type="button"
                  title={user?.full_name || user?.username}
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <span>{user?.full_name || user?.username}</span>
                  <LuChevronDown className={`main-layout__user-caret ${userMenuOpen ? 'main-layout__user-caret--open' : ''}`} aria-hidden="true" />
                </button>

                {userMenuOpen && (
                  <div className="main-layout__user-dropdown" role="menu">
                    {isAdmin && (
                      <Link to="/admin/dashboard" className="main-layout__user-menu-item" role="menuitem">
                        <LuShield aria-hidden="true" />
                        <span>Xem quản trị</span>
                      </Link>
                    )}
                    <button className="main-layout__user-menu-item" onClick={logout} type="button" role="menuitem">
                      <LuLogOut aria-hidden="true" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="main-layout__login-btn">Đăng nhập</Link>
            )}
            <button
              className="main-layout__burger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={menuOpen}
            >
              <span className={`main-layout__burger-line ${menuOpen ? 'main-layout__burger-line--open' : ''}`} />
              <span className={`main-layout__burger-line ${menuOpen ? 'main-layout__burger-line--open' : ''}`} />
              <span className={`main-layout__burger-line ${menuOpen ? 'main-layout__burger-line--open' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="main-layout__content">{children}</main>

      <footer className="main-layout__footer">
        <div className="container main-layout__footer-inner">
          <div className="main-layout__footer-brand">
            <span className="main-layout__footer-logo">
              <LuLeaf aria-hidden="true" />
              Thuận Châu
            </span>
            <p>Hệ thống tra cứu lịch thời vụ và kỹ thuật chăm sóc cây trồng xã Thuận Châu, Sơn La.</p>
          </div>
          <div className="main-layout__footer-links">
            <h4>Chức năng</h4>
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}>{label}</Link>
            ))}
          </div>
          <div className="main-layout__footer-info">
            <h4>Liên hệ</h4>
            <p>
              <LuMapPin aria-hidden="true" />
              Xã Thuận Châu, Sơn La
            </p>
            <p>
              <LuPhone aria-hidden="true" />
              UBND xã Thuận Châu
            </p>
          </div>
        </div>
        <div className="main-layout__footer-bottom">
          <p>© {new Date().getFullYear()} UBND xã Thuận Châu. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
