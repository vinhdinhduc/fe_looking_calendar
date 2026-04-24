import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LuLeaf, LuMapPin, LuPhone } from 'react-icons/lu'
import './MainLayout.css'

const NAV_LINKS = [
  { to: '/',         label: 'Trang chủ' },
  { to: '/plants',   label: 'Cây trồng' },
  { to: '/calendar', label: 'Lịch thời vụ' },
  { to: '/faqs',     label: 'Hỏi & Đáp' },
]

const MainLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
            <Link to="/login" className="main-layout__login-btn">Đăng nhập</Link>
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
